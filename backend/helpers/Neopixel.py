import board
from neopixel import NeoPixel
x = [{1:board.D1},{2:board.D2},{3:board.D3},{4:board.D4},{5:board.D5},
        {6:board.D6},{7:board.D7},{8:board.D8},{9:board.D9},{10:board.D10},
        {11:board.D11},{12:board.D12},{13:board.D13},{14:board.D14},{15:board.D15},
        {16:board.D16},{17:board.D17},{18:board.D18},{19:board.D19},{20:board.D20},
        {21:board.D21},{22:board.D22},{23:board.D23},{24:board.D24},{25:board.D25},
        {26:board.D26}]


class Neopixel:
    def __init__(self, pin, num_pixels):
        self.pixels = NeoPixel(x[pin-1][pin], num_pixels)
        self.__reset()

    def __reset(self):
        self.pixels.fill((0, 0, 0))

    def __calc_volume_to_neopixel(self, max_volume,min_volume,volume):
        return int((volume - min_volume) / (max_volume - min_volume) * 24)

    def show_value(self, volume):
        self.__reset()
        amount = self.__calc_volume_to_neopixel(100,0, volume)
        amount2 = amount - 8
        amount3 = amount - 16

        if amount > 8:
            amount = 8

        if amount2 < 0:
            amount2 = 0
        if amount2 > 8:
            amount2 = 8

        if amount3 < 0:
            amount3 = 0
        if amount3 > 8:
            amount3 = 8

        print('amount',amount)
        if amount > 0:
            for i in range(amount):
                self.pixels[i] = (0, 255, 0) #green

        print('amount2',amount2)
        if amount2 > 0:
            for i in range(amount2):
                self.pixels[i] = (255, 140, 0) #orange

        print('amount3',amount3)
        if amount3 > 0:
            for i in range(amount3):
                self.pixels[i] = (255, 0, 0) #red
        
        

    


    