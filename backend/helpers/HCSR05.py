from random import sample
from RPi import GPIO
from time import sleep,time

# ultrasonic sensor
class HCSR05:
    def __init__(self, echo_pin, trigger_pin):
        self.echo = echo_pin
        self.trigger = trigger_pin
        self.__setup_gpio()

    def __setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.echo, GPIO.IN)
        GPIO.setup(self.trigger, GPIO.OUT)

    def get_distance(self):
        sample = 0
        for i in range(0,10):
            GPIO.output(self.trigger, GPIO.LOW)
            sleep(0.01) # 10ms

            GPIO.output(self.trigger, GPIO.HIGH)
            sleep(0.00001)
            GPIO.output(self.trigger, GPIO.LOW)

            while GPIO.input(self.echo) == 0:
                start_time = time()

            while GPIO.input(self.echo) == 1:
                end_time = time()
            
            time_range = end_time - start_time
            sample += time_range
        result_time_range = sample/10
        return round(result_time_range * 17150,1)
    
