from time import sleep,time
from RPi import GPIO
import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.xxx import xxx

hx = xxx(27,22) # dt, sck

try:
    # waarde afstellen als er niets op zit 
    # later gwn afstellen op plank
    sample = hx.get_sample()
    print(sample)
    ratio = hx.get_ratio()
    print(ratio)
    print('setting ratio and sample')
    hx.set_ratio(ratio)
    hx.set_sample(sample)
    while True:
        # input('Enter to read weight: ')
        print(hx.get_weight())
        # print(hx.get_w())
        
except KeyboardInterrupt as e:
    print(e)
    #pass