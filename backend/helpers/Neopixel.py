import board
from neopixel import NeoPixel
from time import sleep,time
x = [{1:board.D1},{2:board.D2},{3:board.D3},{4:board.D4},{5:board.D5},
        {6:board.D6},{7:board.D7},{8:board.D8},{9:board.D9},{10:board.D10},
        {11:board.D11},{12:board.D12},{13:board.D13},{14:board.D14},{15:board.D15},
        {16:board.D16},{17:board.D17},{18:board.D18},{19:board.D19},{20:board.D20},
        {21:board.D21},{22:board.D22},{23:board.D23},{24:board.D24},{25:board.D25},
        {26:board.D26}]

# klasse Neopixel ring 8
class Neopixel:
    def __init__(self, pin):
        self.pixels = NeoPixel(x[pin-1][pin], 8,brightness=0.2)
        self.reset()
        self.prevAmount = 0

    def reset(self):
        self.pixels.fill((0, 0, 0))

    def __calc_volume_to_neopixel(self, max_volume,min_volume,volume):
        # print('volume: ',volume)
        if volume < max_volume:
            volume = max_volume
        if volume > min_volume:
            volume = min_volume
        return abs(int(((volume - 28.5) * 24)/16.5))

    def show_value(self, volume):
        amount1 = self.__calc_volume_to_neopixel(12,28.5, volume)
        # print(amount1)
        amount2 = amount1 - 8
        amount3 = amount1 - 16
        amounts = [amount1,amount2,amount3]
        rgb = [(0,255,0),(255,140,0),(255,0,0)] # green, orange, red
        # print(amounts)
        if amount1 != self.prevAmount:
            self.reset()
            for i in range(3):
                if amounts[i] < 0:
                    amounts[i] = 0
                if amounts[i] > 8:
                    amounts[i] = 8

            for i in range(3):
                if amounts[i] > 0:
                    for x in range(amounts[i]):
                        self.pixels[x] = rgb[i] # set pixel to rgb
            
            self.prevAmount = amount1
    
    def show_loading(self, color=(38, 74, 255)):#blue default
        self.reset()
        for x in range(8):
            for i in range(8):
                self.pixels[i-1] = (0,0,0)
                self.pixels[i] = color
                sleep(0.08)
        self.reset()
    
    def start_up(self):
        self.reset()
        sleep(0.2)
        self.pixels.fill((0, 255, 0))
        sleep(0.2)
        self.reset()
        sleep(0.2)
        self.pixels.fill((0, 255, 0))
        sleep(0.2)
        self.reset()
        sleep(0.2)
        self.pixels.fill((0, 255, 0))
        sleep(0.2)
        self.reset()

        
        
        

    


    