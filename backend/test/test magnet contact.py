
from RPi import GPIO
from time import sleep,time

import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.Button import Button

magnetcontactDoor = Button(19,500)
magnetcontactValve = Button(26,1000)

def setup():
    GPIO.setmode(GPIO.BCM)
#     magnetcontactDoor.on_press_and_release(demo_calback1)
#     magnetcontactValve.on_press_and_release(demo_calback2)

# def demo_calback1(pin):
#     print(magnetcontactDoor.pressed)
#     print('DOOR')

# def demo_calback2(pin):
#     print(magnetcontactValve.pressed)
#     print('VALVE')

def test():
    global prevStatus1
    global prevStatus2
    status1 = magnetcontactDoor.pressed
    if status1 != prevStatus1:
        if status1 == 1:
            print('**** Magnetcontact door close ****')
        elif status1 == 0 :
            print('**** Magnetcontact door open ****')
        prevStatus1 = status1
        sleep(0.25)
    
    status2 = magnetcontactValve.pressed
    if status2 != prevStatus2:
        if status2 == 1:
            print('**** Magnetcontact valve close ****')
        elif status2 == 0:
            print('**** Magnetcontact valve open ****')
        prevStatus2 = status2
        sleep(1)

try:
    setup()
    print('start')
    prevStatus1 = None
    prevStatus2 = None
    while True:
        sleep(0.00001)
        test()
        # print(magnetcontactValve.pressed)
except Exception as e:
    print(e)
finally:
    GPIO.cleanup()