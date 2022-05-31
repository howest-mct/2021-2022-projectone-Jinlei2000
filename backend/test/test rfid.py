from time import sleep,time
from RPi import GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()

try:
    while True:
        print("Hold a tag near the reader")
        id, text = reader.read()
        print(id)
        print(text)
finally:
        GPIO.cleanup()