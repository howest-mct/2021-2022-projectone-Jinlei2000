from time import sleep,time
from RPi import GPIO
import threading

from repositories.DataRepository import DataRepository

from multiprocessing import Process, Queue, Value 

from mfrc522 import SimpleMFRC522

from helpers.Button import Button
from helpers.Lcd_4bits_i2c import Lcd_4bits_i2c
from helpers.HCSR05 import HCSR05
from helpers.HX711 import HX711
from helpers.SG90 import SG90

from flask_cors import CORS
from flask_socketio import SocketIO, emit, send
from flask import Flask, jsonify, request
from repositories.DataRepository import DataRepository

from selenium import webdriver

# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options

# VARIABELEN
btnLcdPin = Button(5)
btnPoweroffPin = Button(6)

lcd = Lcd_4bits_i2c(0x38)
lcd.init_LCD()
backlight_lcd = 25

servo_door = SG90(24)
servo_valve = SG90(23)
servoDoorStatus = Value('b', False)

reader = SimpleMFRC522()
buzzer = 16

btnStatusPoweroff = False

btnStatusLcd = Value('b', False)
badgeid = Queue()


# CODE VOOR HARDWARE
def setup():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(buzzer,GPIO.OUT)
    GPIO.setup(backlight_lcd,GPIO.OUT)
    GPIO.output(backlight_lcd,GPIO.LOW)

    btnLcdPin.on_press(demo_callback1)
    btnPoweroffPin.on_press(demo_callback2)

def demo_callback1(pin):
    global btnStatusLcd
    print("---- LCD Button pressed ----")
    btnStatusLcd.value = True
    print("**** DB --> LCD Button pressed ****")
    DataRepository.add_history(1,8,5)

def demo_callback2(pin):
    global btnStatusPoweroff
    print("---- Poweroff Pi Button pressed ----")
    btnStatusPoweroff = True
    print("**** DB --> Poweroff Button pressed ****")
    DataRepository.add_history(1,8,7)


def rfid(send_badgeid,servoDoorStatus):
    id, text = reader.read()
    send_badgeid.put([id])
    print(f'**** RFID ID: {id} ****')
    GPIO.output(buzzer, GPIO.HIGH)
    sleep(1)
    GPIO.output(buzzer, GPIO.LOW)
    print("**** DB --> Badge was scanned & buzzer rings ****")
    DataRepository.add_history(id,6,23)
    DataRepository.add_history(id,9,24)
    #controleren op id bestaat in user tabal van database (alle id op halen en checken in list)
    user = DataRepository.check_user_badge_id(id)
    badgeid = user['badgeid']
    if badgeid is not None:
        if badgeid == id:
            #kijken of de duer ni open is
            print('servo unlock door')
            servoDoorStatus.value = True
    #deur open servo functies of klasse maken
    #iets op slaan in database duer is geopend
    #als duer al open is niets doen


# CODE VOOR FLASK
app = Flask(__name__)
app.config['SECRET_KEY'] = 'geheim!'
socketio = SocketIO(app, cors_allowed_origins="*", logger=False,
                    engineio_logger=False, ping_timeout=1)

CORS(app)


@socketio.on_error()        # Handles the default namespace
def error_handler(e):
    print(e)


# API ENDPOINTS
endpoint = '/api/v1'

@app.route('/')
def hallo():
    return "Server is running, er zijn momenteel geen API endpoints beschikbaar."

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

@app.route(endpoint + '/users/<userid>/', methods=['GET'])
def user(userid):
    if request.method == 'GET':
        name = DataRepository.read_username_by_id(userid)
        if name is not None:
            return jsonify(name), 201
        return jsonify(status='error'), 404

@app.route(endpoint + '/users/login/<username>/<password>/', methods=['GET'])
def get_user_id(username,password):
    if request.method == 'GET':
        id = DataRepository.check_user_login(username, password)
        if id is not None:
            return jsonify(id), 201
        return jsonify(status='error'), 404

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

# ALLE THREADS
# Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.

# START RFID
def start_rfid(send_badgeid,servoDoorStatus):
    # print("type",send_badgeid)
    try:
        while True:
            rfid(send_badgeid,servoDoorStatus)
    except:
        pass
    
def start_thread_rfid():
    print("**** Starting THREAD lcd ****")
    # thread = threading.Timer(15, show_ip)
    # thread.start()
    p = Process(target=start_rfid, args=(badgeid,servoDoorStatus,))
    p.start()

# START LCD
def start_lcd(btnStatusLcd):
    tijd = time()
    write_ip_status = True
    try:
        while True:
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
    except:
        pass
    

def start_thread_lcd():
    print("**** Starting THREAD lcd ****")
    p = Process(target=start_lcd, args=(btnStatusLcd,))
    p.start()


# START OPSLAAN DATA
def opslaan_data():
    try:
        while True:
            #om de 60sec opslaan
            # sleep(60)
            pass
    except:
        pass
    
    
def start_thread_opslaan_data():
    print("**** Starting THREAD opslaan data ****")
    # thread = threading.Timer(60, opslaan_data)
    # thread.start()
    p = Process(target=opslaan_data, args=())
    p.start()

# START LIVE DATA
def live_data():
    try:
        while True:
            sleep(1)
    except:
        pass
   
def start_thread_live_data():
    print("**** Starting THREAD live data ****")
    # thread = threading.Timer(0.1, live_data)
    # thread.start()
    p = Process(target=live_data, args=())
    p.start()

# START SERVO DOOR
def servo(servoDoorStatus):
    try:
        while True:
            if servoDoorStatus.value == True:
                servo_door.unlock_door()
                print("**** DB -->  DOOR 2 is unlocked with badge****")
                DataRepository.add_history(None,1,19)
                servoDoorStatus.value = False
    except:
        pass
   
def start_thread_servo():
    print("**** Starting THREAD live data ****")
    thread = threading.Thread(target=servo, args=(servoDoorStatus,), daemon=True)
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
        # chrome_options.add_argument('--no-sandbox')         
        # options.add_argument("disable-infobars")
        options.add_experimental_option("excludeSwitches", ["enable-automation"])
        options.add_experimental_option('useAutomationExtension', False)

        driver = webdriver.Chrome(options=options)
        driver.get("http://localhost")
        while True:
            pass
    except:
        pass

def start_chrome_thread():
    print("**** Starting CHROME ****")
    # chromeThread = threading.Thread(target=start_chrome_kiosk, args=(), daemon=True)
    # chromeThread.start()
    p = Process(target=start_chrome_kiosk, args=())
    p.start()

# START QUEUE
def read_list_out_Process():
    try:
        while True:
            # Ik haal hier de data uit de queue (uit mijn multiprocessing Process) en print het
            list_data = badgeid.get()
            # print(">>", list_data)
            id = list_data[0]
            socketio.emit('B2F_sendBadgeId', {'badgeid': id})
            sleep(0.5)
            
    except:
        pass

def start_thread_Queue():
    xThread = threading.Thread(target=read_list_out_Process, args=(), daemon=True)
    xThread.start()

if __name__ == '__main__':
    try:
        start = time()
        setup()
        start_thread_lcd()
        start_thread_live_data()
        start_thread_opslaan_data()
        start_thread_rfid()
        start_thread_servo()
        start_chrome_thread()
        start_thread_Queue()
        end = time()
        print(f"Threads elapsed time: {(end-start):.3f}s")
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
        # socketio.run(app, host='0.0.0.0', debug=False, keyfile='/etc/ssl/private/private.key', certfile='/etc/ssl/certs/certificate.crt')
    except KeyboardInterrupt:
        print('KeyboardInterrupt exception is caught')
        # scherm backlight uitzetten
        GPIO.output(backlight_lcd, GPIO.LOW)
        # scherm leegmaken en 8 bits instellen
        lcd.cursorOn()
        lcd.clear_LCD()
        lcd.set_to_8bits()
        # i2c afsluiten
        lcd.close_i2c()

    finally:
        GPIO.cleanup()

