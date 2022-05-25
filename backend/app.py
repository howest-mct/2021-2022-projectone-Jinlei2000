from time import sleep,time
from RPi import GPIO
import threading

from repositories.DataRepository import DataRepository

from multiprocessing import Process, Queue

from mfrc522 import SimpleMFRC522

from helpers.Button import Button
from helpers.Lcd_4bits_i2c import Lcd_4bits_i2c

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

reader = SimpleMFRC522()
buzzer = 16

btnStatusLcd = False
btnStatusPoweroff = False

q = Queue()

# CODE VOOR HARDWARE
def setup():
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)

    GPIO.setup(buzzer,GPIO.OUT)
    GPIO.setup(backlight_lcd,GPIO.OUT)
    GPIO.output(backlight_lcd,GPIO.LOW)

    btnLcdPin.on_press(demo_callback1)
    btnPoweroffPin.on_press(demo_callback2)

def echo_proc():
    print("echo proc")

def demo_callback1(pin):
    global btnStatusLcd
    print("---- LCD Button pressed ----")
    GPIO.output(backlight_lcd, GPIO.HIGH)
    btnStatusLcd = True
    print(f'**** Showing IP WLAN: {lcd.get_ip_wlan0()} ****')
    lcd.write_ip_adres('wlan0')


def demo_callback2(pin):
    global btnStatusPoweroff
    print("---- Poweroff Pi Button pressed ----")
    btnStatusPoweroff = True

def rfid(q):
    print("socketio")
    id, text = reader.read()
    q.put([id])
    print(f'**** RFID ID: {id} ****')
    GPIO.output(buzzer, GPIO.HIGH)
    sleep(1)
    GPIO.output(buzzer, GPIO.LOW)
    #controleren op id bestaat in user tabal van database (alle id op halen en checken in list)
    #deur open servo functies of klasse maken
    #iets op slaan in database duer is geopend
    #als duer al open is niets doen

def servo_turn(servo, angle):
    pass



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

@app.route(endpoint + '/users/', methods=['POST'])
def users():
    if request.method == 'POST':
        gegevens = DataRepository.json_or_formdata(request)
        nieuw_id = DataRepository.create_user(
            gegevens['username'], gegevens['password'], gegevens['badgeId'])
        return jsonify(badgeid=nieuw_id), 201
        #een error opvangen


@socketio.on('connect')
def initial_connection():
    print('A new client connect')
    socketio.emit('B2F_sendBadgeId', {'badgeid': 'teszt'})





# ALLE THREADS
# Belangrijk!!! Debugging moet UIT staan op start van de server, anders start de thread dubbel op
# werk enkel met de packages gevent en gevent-websocket.

# START RFID & LCD
def start_rfid_lcd(q):
    global btnStatusLcd
    print("cb",q)
    # cb()
    tijd = time()
    while True:
        if btnStatusLcd == True:
            GPIO.output(backlight_lcd, GPIO.HIGH)
            # print(time()-tijd)
            if((time()-tijd)>10):
                btnStatusLcd = False
        else:
            lcd.clear_LCD()
            GPIO.output(backlight_lcd, GPIO.LOW)
            tijd = time()
        rfid(q)

def start_thread_rfid_lcd():
    print("**** Starting THREAD lcd ****")
    # thread = threading.Timer(15, show_ip)
    # thread.start()
    p = Process(target=start_rfid_lcd, args=(q,))
    p.start()

# # START OPSLAAN DATA
# def opslaan_data():
#     while True:
#         sleep(60)
    
# def start_thread_opslaan_data():
#     print("**** Starting THREAD opslaan data ****")
#     thread = threading.Timer(60, opslaan_data)
#     thread.start()

# # START LIVE DATA
# def live_data():
#     pass
   
# def start_thread_live_data():
#     print("**** Starting THREAD live data ****")
#     thread = threading.Timer(0.1, live_data)
#     thread.start()

# START CHROME KIOSK
def start_chrome_kiosk():
    import os

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

def start_chrome_thread():
    print("**** Starting CHROME ****")
    # chromeThread = threading.Thread(target=start_chrome_kiosk, args=(), daemon=True)
    # chromeThread.start()
    p = Process(target=start_chrome_kiosk, args=())
    p.start()

def read_q():
    while True:
        qu = q.get()
        print(">>", qu)
        socketio.emit('B2F_sendBadgeId', {'badgeid': qu[0]})

        sleep(0.5)

def proc_main_comm():
    qThread = threading.Thread(target=read_q, args=(), daemon=True)
    qThread.start()



if __name__ == '__main__':
    try:
        setup()
        # start_thread_live_data()
        # start_thread_opslaan_data()
        start_thread_rfid_lcd()
        start_chrome_thread()
        proc_main_comm()
        print("**** Starting APP ****")
        socketio.run(app, debug=False, host='0.0.0.0')
    except KeyboardInterrupt:
        print ('KeyboardInterrupt exception is caught')
        
        GPIO.output(backlight_lcd, GPIO.LOW)

        # scherm leegmaken en 8 bits instellen
        lcd.cursorOn()
        lcd.clear_LCD()
        lcd.set_to_8bits()
        # i2c afsluiten
        lcd.close_i2c()

    finally:
        GPIO.cleanup()

