from RPi import GPIO
from time import sleep,time

# servo
class SG90:

    def __init__(self, pin):
        self.pin = pin
        self.__setup_gpio()

    def __setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)

        self.pwm = GPIO.PWM(self.pin, 50)
        self.pwm.start(0)
        # self.lock_door()
    
    def __set_angle(self, angle):
        # bereken: (100%/20ms)*0,5ms = 2.5% duty-cycle --> min
        # bereken: (100%/20ms)*2,5ms = 12.5% duty-cycle --> max
        # verschil/range 12.5-2.5 = 10
        max = 12.5
        min = 2.5
        duty = ((max - min)/180)*angle + min
        # print(duty)
        self.pwm.ChangeDutyCycle(duty)
        sleep(0.15)  # 50ms
        self.pwm.ChangeDutyCycle(0)

    def unlock_door(self):
        self.__set_angle(70)
    
    def lock_door(self):
        self.__set_angle(0)

    def unlock_valve(self):
        self.__set_angle(0)
    
    def lock_valve(self):
        self.__set_angle(107)
    
    def angle(self,angle):
        # self.__set_angle(angle)
        self.pwm.ChangeDutyCycle(angle)
        sleep(0.5)  # 50ms
        self.pwm.ChangeDutyCycle(0)
       
