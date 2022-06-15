from RPi import GPIO
from time import sleep,time
from subprocess import call
from repositories.DataRepository import DataRepository
from helpers.Neopixel import Neopixel


power = 6

def setup():
    GPIO.setmode(GPIO.BCM) 
    GPIO.setwarnings(False)
    GPIO.setup(power, GPIO.IN, GPIO.PUD_UP)
    GPIO.add_event_detect(power,GPIO.FALLING,demo_callback,bouncetime=2000)

def demo_callback(pin):
    global teller
    status = call(["systemctl", "is-active", "--quiet", "mijnproject"])
    # print(status)
    if status != 0:
        call("sudo systemctl start mijnproject.service", shell=True)
        print('ON')
    else:
        sleep(1)
        call("sudo systemctl stop mijnproject.service", shell=True)
        print('OFF')


try:
    print("Powerbutton")
    setup()
    start_time = 0
    status = False
    while True:
        try:
            if GPIO.input(power) == 0 and status == False:
                start_time = time()
                status = True
            if GPIO.input(power) == 1:
                status = False
            if status == True:
                if(time()-start_time)>6:
                    print('SUDO POWEROFF')
                    if call(["systemctl", "is-active", "--quiet", "mijnproject"]) == 0:
                        call("sudo systemctl stop mijnproject.service", shell=True)
                    np = Neopixel(12)
                    np.show_loading((255,0,0))
                    print("**** DB --> RGB led loading shutting down pi ****")
                    DataRepository.add_history(None,7,30)
                    print("**** DB --> Pi is shutting down ****")
                    DataRepository.add_history(None,10,8)
                    sleep(2)
                    # call("sudo poweroff", shell=True)
        except Exception as e:
            print(e)
except Exception as e:
    print(e)
    GPIO.cleanup()