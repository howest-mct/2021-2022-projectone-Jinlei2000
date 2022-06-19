import multiprocessing
from time import sleep,time
import datetime
from RPi import GPIO
import threading

from repositories.DataRepository import DataRepository

from multiprocessing import Process, Queue, Value 
from subprocess import call 

from mfrc522 import SimpleMFRC522

from helpers.Button import Button
from helpers.Lcd_4bits_i2c import Lcd_4bits_i2c
from helpers.HCSR05 import HCSR05
from helpers.HX711_Weight import HX711_Weight
from helpers.SG90 import SG90
from helpers.Neopixel import Neopixel

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required,create_access_token, get_jwt_identity
from repositories.DataRepository import DataRepository

from selenium import webdriver

# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options

# VARIABLES
btnLcdPin = Button(5)
btnPoweroffPin = Button(6)
btnPoweroffLed = 13

magnetcontactDoor = Button(19)
magnetcontactValve = Button(26)

lcd = Lcd_4bits_i2c(0x38)
lcd.init_LCD()
lcd.curscorBlinkOff()
backlight_lcd = 25

servo_door = SG90(24)
servo_valve = SG90(23)
servoDoorStatus = Value('b', False)
servoValveStatus = Value('b', False)

ultrasonic_sensor = HCSR05(echo_pin=21,trigger_pin=20)

weight_sensor = HX711_Weight(dout_pin=27,sck_pin=22)

reader = SimpleMFRC522()
buzzer = 16


btnStatusLcd = Value('b', False)
badgeid = Queue()


np = Neopixel(12)
loadingStatus = Value('b', True)
loadingStatusShutdown = Value('b', False)

# CODE FOR HARDWARE
def setup():
    print("**** DB --> Pi is starting up ****")
    DataRepository.add_history(None,None,28)
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(buzzer,GPIO.OUT)
    GPIO.setup((backlight_lcd,btnPoweroffLed),GPIO.OUT)
    GPIO.output(backlight_lcd,GPIO.LOW)
    GPIO.output(btnPoweroffLed,GPIO.HIGH)

    btnLcdPin.on_press(demo_callback1)
    btnPoweroffPin.on_release(demo_callback2)

def demo_callback1(pin):
    global btnStatusLcd
    print("---- LCD Button pressed ----")
    btnStatusLcd.value = True
    print("**** DB --> LCD Button pressed ****")
    DataRepository.add_history(1,8,5)

def cleanup():
    print("**** Cleaning up ****")
    GPIO.output(btnPoweroffLed,GPIO.LOW)
    GPIO.output(backlight_lcd, GPIO.LOW)
    lcd.clear_LCD()
    # GPIO.cleanup() 

def poweroff():
    socketio.emit('B2F_button', {'message': 'poweroff'})
    lcd.write("Powering off...")
    GPIO.output(backlight_lcd, GPIO.HIGH)
    np.show_loading((255,0,0))
    print("**** DB --> RGB led loading shutting down pi ****")
    DataRepository.add_history(None,7,30)
    print("**** DB --> Pi is shutting down ****")
    DataRepository.add_history(None,10,8)
    GPIO.output(btnPoweroffLed,GPIO.LOW)
    cleanup()
    sleep(1)
    call("sudo poweroff", shell=True)

def demo_callback2(pin):
    cleanup()
    # loadingStatusShutdown.value = True
    print("---- Poweroff Pi Button pressed ----")
    print("**** DB --> Poweroff Button pressed ****")
    DataRepository.add_history(1,8,7)

def rfid(send_badgeid,servoDoorStatus):
    try:
        id, text = reader.read()
        send_badgeid.put([id])
        print(f'**** RFID ID: {id} ****')
        GPIO.output(buzzer, GPIO.HIGH)
        sleep(1)
        GPIO.output(buzzer, GPIO.LOW)
        print("**** DB --> Badge was scanned & buzzer rings ****")
        DataRepository.add_history(id,6,23)
        DataRepository.add_history(None,9,24)
        user = DataRepository.check_user_badge_id(id)
        badgeid = user['badgeid']
        if badgeid is not None:
            if badgeid == id:
                if magnetcontactDoor.pressed == True:
                    print('servo unlock door')
                    servoDoorStatus.value = True
    except Exception as e:
        print("rfid crashed!! ",e)
    
# CODE FOR FLASK
app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!!!!!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False,engineio_logger=False, ping_timeout=1)
jwt = JWTManager(app)
CORS(app)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)


# API ENDPOINTS
endpoint = '/api/v1'

@app.route('/')
def hallo():
    return "Server is running, Welcome to the server"

@app.route(endpoint + '/users/', methods=['GET','POST'])
def users():
    if request.method == 'GET':
        return jsonify(DataRepository.all_users_badge_id()), 201
    elif request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        nieuw_id = DataRepository.add_user(
            gegevens['username'], gegevens['password'], gegevens['badgeId'])
        if nieuw_id is not None:
            if nieuw_id > 0:
                return jsonify(badgeid=nieuw_id), 201
        return jsonify(status='error'), 404

@app.route(endpoint + '/users/<userid>/', methods=['GET','DELETE'])
def user(userid):
    if request.method == 'GET':
        name = DataRepository.read_username_by_id(userid)
        if name is not None:
            return jsonify(name), 201
        return jsonify(status='error'), 404
    if request.method == 'DELETE':
        id = DataRepository.delete_user(userid)
        return jsonify(status='ok'), 201

@app.route(endpoint + '/users/login/', methods=['POST'])
def get_user_id():
    if request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        username = gegevens['username']
        password = gegevens['password']
        id = DataRepository.check_user_login(username, password)
        if id is not None:
            expires = datetime.timedelta(minutes=20)
            access_token = create_access_token(identity=username, expires_delta=expires)
            return jsonify(id=id,access_token=access_token), 201
        return jsonify(status='error'), 404

@app.route(endpoint + '/protected/', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
    
@app.route(endpoint + '/info/', methods=['GET','PUT'])
def info():
    if request.method == 'GET':
        data = DataRepository.get_info()
        return jsonify(data), 201
    if request.method == 'PUT':
        gegevens = DataRepository.json_or_formdata(request)
        DataRepository.update_location(gegevens['address'], gegevens['coordinates'], gegevens['name'])
        return jsonify(status='updated location'), 201

@app.route(endpoint + '/history/<time>/', methods=['GET'])
def get_history(time):
    if request.method == 'GET':
        data = DataRepository.filter_history_by_time(time)
        return jsonify(table=data), 201

@app.route(endpoint + '/history/average/<time>/', methods=['GET'])
def get_average(time):
    if request.method == 'GET':
        data = DataRepository.filter_average_value_by_time(time)
        return jsonify(data), 201

@app.route(endpoint + '/history/total/<time>/', methods=['GET'])
def get_total(time):
    if request.method == 'GET':
        data = DataRepository.filter_total_value_by_time(time)
        return jsonify(data), 201

@app.route(endpoint + '/history/charts/<time>/<actionid>/', methods=['GET'])
def get_charts(time,actionid):
    if request.method == 'GET':
        data = DataRepository.filter_chart_data_by_time_actionid(time,actionid)
        return jsonify(data), 201

try:
    @socketio.on('connect')
    def initial_connection():
        print('A new client connect')
        

    @socketio.on('F2B_addNewUser')
    def add_new_user():
        print("**** DB --> New User added ****")
        DataRepository.add_history(None,None,14)

    @socketio.on('F2B_LoggedInUser')
    def logged_in_user():
        print("**** DB --> Logged in user ****")
        DataRepository.add_history(None,None,17)

    @socketio.on('F2B_buttons')
    def buttons(payload):
        btn_type = payload['button']
        if btn_type == 'poweroff':
            print("**** DB --> Remote poweroff button pressed ****")
            DataRepository.add_history(None,None,25)
            poweroff()
        if btn_type == 'open':
            if magnetcontactDoor.pressed == True:
                    print("**** DB -->  Remote open button pressed****")
                    DataRepository.add_history(None,None,26)
                    servoDoorStatus.value = True
                    socketio.emit('B2F_button', {'message': 'opening'})
            else:
                socketio.emit('B2F_button', {'message': 'already opened'})
except Exception as e:
    print("socket crashed!! ",e)
        
    
# ALL THREADS
# Important!!! Debugging must be OFF on server startup, otherwise thread will start twice
# only work with the packages gevent and gevent-websocket.

# START RFID
def start_rfid(send_badgeid,servoDoorStatus):
    # print("type",send_badgeid)
    try:
        while True:
            rfid(send_badgeid,servoDoorStatus)
    except:
        pass
    
def start_thread_rfid():
    print("**** Starting THREAD rfid ****")
    p = Process(target=start_rfid, args=(badgeid,servoDoorStatus,))
    p.start()

# START LCD
def start_lcd(btnStatusLcd,loadingStatus):
    tijd = time()
    write_ip_status = True
    try:
        while True:
            try:
                if loadingStatus.value == True:
                    lcd.write("Starting...")
                    GPIO.output(backlight_lcd, GPIO.HIGH)
                    np.show_loading()
                    print("**** DB --> RGB led loading starting pi ****")
                    DataRepository.add_history(None,7,29)
                    loadingStatus.value = False
                    
                if btnStatusLcd.value == True:
                    if write_ip_status == True:
                        print(f'**** Showing IP WLAN: {lcd.get_ip_wlan0()} ****')
                        lcd.write_ip_adres('wlan0')
                        GPIO.output(backlight_lcd, GPIO.HIGH)
                        write_ip_status = False
                        print("**** DB --> LCD on & show ip ****")
                        DataRepository.add_history(None,5,12)
                        DataRepository.add_history(None,5,6)
                    # print(time()-tijd)
                    if((time()-tijd)>10):
                        btnStatusLcd.value = False
                        print("**** DB --> LCD off ****")
                        DataRepository.add_history(None,5,13)
                else:
                    lcd.clear_LCD()
                    GPIO.output(backlight_lcd, GPIO.LOW)
                    tijd = time()
                    write_ip_status = True
            except Exception as e:
                print('start_lcd crashed!! ',e)
    except:
        print('Error thread lcd!!!')

def start_thread_lcd():
    print("**** Starting THREAD lcd ****")
    p = Process(target=start_lcd, args=(btnStatusLcd,loadingStatus))
    p.start()

# START SAVE DATA
def save_data():
    try:
        while True:
            try:
                if magnetcontactValve.pressed == True:
                    #hier nog een sockect emit plaatsen da je pagina kan refreshen van alle paginas behalve map.html, index.html and welcome.html
                    weight = round(weight_sensor.get_weight(),2)
                    last_weight = DataRepository.get_last_value_weight()
                    # print(f'weight: {weight}, last weight:  {last_weight}, {type(last_weight)}')
                    if weight == 0 and last_weight != 0:
                        DataRepository.update_weight()
                    if weight != last_weight:
                        print("**** DB --> Weight ****")
                        DataRepository.add_history(weight,4,10)
                    
                    volume = round(ultrasonic_sensor.get_distance())
                    last_volume = DataRepository.get_last_value_volume()
                    if volume < 12:
                        volume = 12
                    if volume > 28:
                        volume = 28
                    # print(volume,' ',type(volume),'/',last_volume,' ',type(last_volume))
                    if volume != last_volume and magnetcontactValve.pressed == True:
                        print("**** DB --> Volume ****")
                        DataRepository.add_history(volume,3,9)
                        print("**** DB --> RGB led show value volume ****")
                        DataRepository.add_history(None,7,11)
                    socketio.emit('B2F_refresh_data')
                    sleep(60)
            except Exception as e:
                print('save_data gecrasht!!',e)
                sleep(60)
    except Exception as e:
        print('Error thread save_data!!!',e)
    
def start_thread_save_data():
    print("**** Starting THREAD save data ****")
    thread = threading.Thread(target=save_data, args=(), daemon=True)
    thread.start()

# START LIVE DATA
def live_data(loadingStatus,loadingStatusShutdown): 
    try:
        prev_volume = 30
        servoValveStatus = False
        servo_valve.lock_valve()
        servo_valve.unlock_valve()
        sleep(0.5)
        while True:
            try:
                volume = ultrasonic_sensor.get_distance()
                procent_volume = round(abs((((volume - 28.5) * 100)/16.5)),0)
                if procent_volume > 100:
                    procent_volume = 100
                if procent_volume < 5:
                    procent_volume = 0
                if procent_volume > 90 and servoValveStatus == False and magnetcontactValve.pressed == True:
                    servo_valve.lock_valve()
                    print("**** DB -->  DOOR 1 is locked****")
                    DataRepository.add_history(None,1,3)
                    servoValveStatus = True
                    socketio.emit('B2F_full_volume', broadcast=True)
                elif procent_volume < 90 and servoValveStatus == True:
                    servo_valve.unlock_valve()
                    print("**** DB -->  DOOR 1 is unlocked****")
                    DataRepository.add_history(None,1,4)
                    servoValveStatus = False
                if magnetcontactValve.pressed == False:
                    volume = prev_volume
                weight = round(weight_sensor.get_weight(),2)
                door_status = magnetcontactDoor.pressed
                valve_status = magnetcontactValve.pressed
                opened_times = DataRepository.filter_number_of_times_by_time_actionid(1,2)
                emptied_times = DataRepository.filter_number_of_times_by_time_actionid(1,22)
                socketio.emit('B2F_live_data',{
                    'volume': volume,
                    'weight': weight,
                    'door': door_status,
                    'valve': valve_status,
                    'opened_times': opened_times,
                    'emptied_times': emptied_times
                }, broadcast=True)
                if loadingStatus.value == False and loadingStatusShutdown.value == False and magnetcontactValve.pressed == True:
                    # print(volume-prev_volume)
                    if procent_volume == 0:
                        np.show_value(28.5)
                        prev_volume = 28.5
                    if prev_volume != volume and (1.5 < volume-prev_volume or volume-prev_volume < -1.5):
                        # print(f'Volume: {volume}, Prev_volume: {prev_volume}')
                        np.show_value(volume)
                        prev_volume = volume

                sleep(0.5) # 500 ms
            except Exception as e:
                print('live_data crashed!!',e)
                sleep(0.5)
    except Exception as e:
        print('Error thread live_data!!! ',e)

def start_thread_live_data():
    print("**** Starting THREAD live data ****")
    thread = threading.Thread(target=live_data, args=(loadingStatus,loadingStatusShutdown), daemon=True) 
    thread.start()

# START SERVO & MAGNETCONTACT
def servo_magnet(servoDoorStatus):
    try:
        prevStatus1 = 1
        prevStatus2 = 1
        tijd = 0
        if servoDoorStatus.value == True:
            servo_door.lock_door()
        else:
            servo_door.unlock_door()
        while True:
            try:
                if servoDoorStatus.value == True:
                    servo_door.unlock_door()
                    sleep(0.5)
                    print("**** DB -->  DOOR 2 is unlocked with badge****")
                    DataRepository.add_history(None,1,19)
                    servoDoorStatus.value = False
                    tijd = time()

                if servoDoorStatus.value == False and magnetcontactDoor.pressed == True:
                    if tijd is not None:
                        # print(time()-tijd)
                        if((time()-tijd)>15):
                            servo_door.lock_door()
                            sleep(0.5)
                            print("**** DB -->  DOOR 2 is locked****")
                            DataRepository.add_history(None,1,21)
                            tijd = None

                status1 = magnetcontactDoor.pressed
                if status1 != prevStatus1:
                    if status1 == 1:
                        print('**** Magnetcontact door close ****')
                        DataRepository.add_history(1,2,20)
                    elif status1 == 0 :
                        print('**** Magnetcontact door open ****')
                        DataRepository.add_history(1,2,22)
                    prevStatus1 = status1
                    sleep(0.25)
                    # sleep(0.3)
                
                status2 = magnetcontactValve.pressed
                if status2 != prevStatus2:
                    if status2 == 1:
                        print('**** Magnetcontact valve close ****')
                        DataRepository.add_history(1,2,1)
                    elif status2 == 0:
                        print('**** Magnetcontact valve open ****')
                        DataRepository.add_history(1,2,2)
                    prevStatus2 = status2
                    sleep(0.75)
                    # sleep(0.3)
                sleep(0.00001)
            except Exception as e:
                print('servo_magnet crashed!!',e)
                sleep(0.5)
    except:
        print('Error thread servo & magnetcontact!!!')
   
def start_thread_servo_magnet():
    print("**** Starting THREAD servo & magnetcontact ****")
    thread = threading.Thread(target=servo_magnet, args=(servoDoorStatus,), daemon=True)
    thread.start()

# START CHROME KIOSK
def start_chrome_kiosk():
    import os
    try:
        os.environ['DISPLAY'] = ':0.0'
        options = webdriver.ChromeOptions()
        # options.headless = True
        # options.add_argument("--window-size=1920,1080")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36")
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--allow-running-insecure-content')
        options.add_argument("--disable-extensions")
        # options.add_argument("--proxy-server='direct://'")
        options.add_argument("--proxy-bypass-list=*")
        options.add_argument("--start-maximized")
        options.add_argument('--disable-gpu')
        # options.add_argument('--disable-dev-shm-usage')
        options.add_argument('--no-sandbox')
        options.add_argument('--kiosk')
        options.add_argument('--remote-debugging-port=9923')
        # chrome_options.add_argument('--no-sandbox')         
        # options.add_argument("disable-infobars")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)

        driver = webdriver.Chrome(options=options)
        driver.get("http://localhost")
        while True:
            pass
    except Exception as e:
        print('Error thread chrome!!!',e)

def start_chrome_thread():
    print("**** Starting CHROME ****")
    p = Process(target=start_chrome_kiosk, args=())
    p.start()

# START QUEUE
def read_list_out_Process():
    try:
        while True:
            try:
                list_data = badgeid.get()
                # print(">>", list_data)
                id = list_data[0]
                socketio.emit('B2F_sendBadgeId', {'badgeid': id})
                sleep(0.5)
            except Exception as e:
                print('read_list_out_Process crashed!!',e)
    except:
        print('Error thread read_list_out_Process!!!',e)

def start_thread_Queue():
    xThread = threading.Thread(target=read_list_out_Process, args=(), daemon=True)
    xThread.start()

if __name__ == '__main__':
    try:
        try:
            start = time()
            setup()
            start_thread_lcd()
            start_thread_live_data()
            start_thread_save_data()
            start_thread_rfid()
            start_thread_servo_magnet()
            start_thread_Queue()
            # start_chrome_thread()
            print(f"Threads elapsed time: {(time()-start):.3f}s")
            print("**** Starting APP ****")
            socketio.run(app, debug=False, host='0.0.0.0')
        except Exception as e:
            print('Error main!!!',e)
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
        # LCD backlight off
        GPIO.output(btnPoweroffLed,GPIO.LOW)
        GPIO.output(backlight_lcd, GPIO.LOW)
        # clean and set 8-bit mode
        lcd.cursorOn()
        lcd.clear_LCD()
        lcd.set_to_8bits()
        # close i2c bus
        lcd.close_i2c()

    finally:
        GPIO.cleanup()

