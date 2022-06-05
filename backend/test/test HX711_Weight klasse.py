from time import sleep,time
from RPi import GPIO
import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.HX711_Weight import HX711_Weight

hx = HX711_Weight(27, 22) #dt, sck

try:
    while True:
        print(hx.get_weight())
        sleep(1)
except KeyboardInterrupt:
    print('\nDone')
    GPIO.cleanup()