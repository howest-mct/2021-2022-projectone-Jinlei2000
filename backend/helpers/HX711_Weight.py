from RPi import GPIO
from hx711 import HX711  

class HX711_Weight():

    def __init__(self,dout_pin, sck_pin) -> None:
        GPIO.setmode(GPIO.BCM)  
        self.hx = HX711(dout_pin,sck_pin)
        self.__setup()
    
    def __setup(self):
        self.hx.set_offset(-221501) # set offset
        ratio = 75759 / 148 
        self.hx.set_scale_ratio(ratio)  # set ratio for current channel
    
    def get_weight(self):
        grams = self.hx.get_weight_mean(5)
        if grams < 0:
            grams = 0
        kilograms = round(grams/1000,3)
        return kilograms
