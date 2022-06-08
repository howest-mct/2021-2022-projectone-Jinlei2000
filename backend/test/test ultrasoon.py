from time import sleep,time
from RPi import GPIO
import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.HCSR05 import HCSR05


ultrasonic = HCSR05(echo_pin=21, trigger_pin=20)
   
try:
    while True:
        distance = ultrasonic.get_distance()
        print(distance,'cm')
        sleep(1)

except KeyboardInterrupt as e:
    print(e)
    #pass
finally:
    GPIO.cleanup()
    print("Script has stopped!!!")

