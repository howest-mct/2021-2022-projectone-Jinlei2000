from time import sleep,time
from RPi import GPIO
from helpers.HX711 import HX711

hx711 = HX711(27,22) # dt, sck
sample = 1799462

try:
    # waarde afstellen als er niets op zit 
    # later gwn afstellen op plank
    print(hx711.get_sample())
    while True:
        x = input('Enter to read weight: ')
        print('gewicht: ',hx711.get_weight(sample))
except KeyboardInterrupt as e:
    print(e)
    #pass

