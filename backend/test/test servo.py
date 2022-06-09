from time import sleep,time
from RPi import GPIO
import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.SG90 import SG90

servo_door = SG90(24)
servo_valve = SG90(23)

try:
    while True:
        x = input("Enter close: ")
        servo_door.lock_door()
        servo_valve.lock_valve()
        x = input("Enter open: ")
        servo_door.unlock_door()
        servo_valve.unlock_valve()
        
except KeyboardInterrupt as e:
    print(e)
    #pass
finally:
    GPIO.cleanup()