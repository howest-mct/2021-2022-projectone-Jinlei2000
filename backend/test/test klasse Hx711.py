from time import sleep,time
from RPi import GPIO
import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.HX711 import HX711

hx711 = HX711(27,22) # dt, sck

try:
    # waarde afstellen als er niets op zit 
    # later gwn afstellen op plank
    while True:
        # x = input('Enter to read weight: ')
        print('gewicht: ',hx711.get_weight())
except KeyboardInterrupt as e:
    print(e)
    #pass

