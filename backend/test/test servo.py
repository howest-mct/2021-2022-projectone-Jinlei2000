from time import sleep,time
from RPi import GPIO
from helpers.SG90 import SG90

servo_door = SG90(24)
servo_valve = SG90(23)

try:
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