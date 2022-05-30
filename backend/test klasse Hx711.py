from time import sleep,time
from RPi import GPIO
from helpers.HX711 import HX711

hx711 = HX711(27,22) # dt, sck

try:
    # waarde afstellen als er niets op zit 
    # later gwn afstellen op plank
    while True:
        x = input('Enter to read weight: ')
        print('gewicht: ',hx711.get_weight())
except KeyboardInterrupt as e:
    print(e)
    #pass

