import board
from neopixel import NeoPixel


pixels = NeoPixel(board.D12, 8)
for i in range(8):
    pixels[i] = (0, 0, 255)

