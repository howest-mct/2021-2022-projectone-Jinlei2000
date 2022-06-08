from RPi import GPIO
from hx711 import HX711  

class HX711_Weight():

    def __init__(self,dout_pin, sck_pin) -> None:
        GPIO.setmode(GPIO.BCM)  
        self.hx = HX711(dout_pin,sck_pin)
        self.__setup()
    
    def __setup(self):
        self.hx.set_offset(-183636) # set offset
        ratio = 74122 / 148 
        self.hx.set_scale_ratio(ratio)  # set ratio for current channel
    
    def get_weight(self):
        grams = self.hx.get_weight_mean(5)
        if grams < 5:
            grams = 0
        kilograms = round(grams/1000,3)
        return kilograms
