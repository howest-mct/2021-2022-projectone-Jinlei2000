from RPi import GPIO
from time import sleep,time
from subprocess import call
from repositories.DataRepository import DataRepository
from helpers.Neopixel import Neopixel
from helpers.Lcd_4bits_i2c import Lcd_4bits_i2c


def setup():
    GPIO.setmode(GPIO.BCM) 
    GPIO.setwarnings(False)
    GPIO.setup(backlight_lcd,GPIO.OUT)
    GPIO.setup(power, GPIO.IN, GPIO.PUD_UP)
    GPIO.add_event_detect(power,GPIO.FALLING,demo_callback,bouncetime=2000)
    GPIO.output(backlight_lcd,GPIO.HIGH)


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
    backlight_lcd = 25
    power = 6
    print("Powerbutton")
    setup()
    lcd = Lcd_4bits_i2c(0x38)
    lcd.init_LCD()
    np = Neopixel(12)
    np.start_up()
    start_time = 0
    status = False
    time_lcd = time()
    lcd_on = True
    lcd.write('Booting...')
    while True:
        try:
            if GPIO.input(power) == 0 and status == False:
                start_time = time()
                status = True
            if GPIO.input(power) == 1:
                status = False
            if status == True:
                if(time()-start_time)>5:
                    lcd = Lcd_4bits_i2c(0x38)
                    lcd.init_LCD()
                    lcd.clear_LCD()
                    lcd.curscorBlinkOff()
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
                    np.reset()
                    call("sudo poweroff", shell=True)
            if(time()-time_lcd)>5 and lcd_on == True:
                GPIO.output(backlight_lcd,GPIO.LOW)
                lcd.clear_LCD()
                lcd.curscorBlinkOff()
                lcd_on = False
        except Exception as e:
            print(e)
except Exception as e:
    print(e)
    GPIO.cleanup()