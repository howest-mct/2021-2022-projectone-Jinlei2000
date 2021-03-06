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
        try:
            sample = 0
            for i in range(0,10):
                GPIO.output(self.trigger, GPIO.LOW)
                sleep(0.01) # 10ms

                GPIO.output(self.trigger, GPIO.HIGH)
                sleep(0.00001)
                GPIO.output(self.trigger, GPIO.LOW)
                start = time()
                start_time = 0
                while time() - start < 1000000 and GPIO.input(self.echo) == 0:
                    start_time = time()
                if time() - start < 1000000:
                    start = time()
                    while time() - start < 1000000 and  GPIO.input(self.echo) == 1:
                        end_time = time()
                    
                    time_range = end_time - start_time
                    sample += time_range
            result_time_range = sample/10
            volume = round(result_time_range * 17150,1)
            # print(volume)
            if volume > 50: 
                volume = 12
            return volume
        except Exception as e:
            print("error class HCSR05",e)
    
