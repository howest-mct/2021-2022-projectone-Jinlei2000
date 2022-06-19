import sys
sys.path.append('/home/student/2021-2022-projectone-Jinlei2000/backend')
from helpers.Neopixel import Neopixel
from time import sleep

np = Neopixel(12)
while True:
    try:
        value = int(input("Enter a value between 0 and 100: "))
        np.start_up()
        # np.show_value(value)
        # np.show_loading()
    except Exception as e:
        print(e)







