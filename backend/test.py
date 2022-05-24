from time import sleep,time
from RPi import GPIO
from mfrc522 import SimpleMFRC522

reader = SimpleMFRC522()
buzzer = 16
knop = 6

def setup():
    print('start')
    # GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(buzzer, GPIO.OUT)

    GPIO.setup(knop,GPIO.IN,GPIO.PUD_UP)
    GPIO.add_event_detect(knop,GPIO.FALLING,demo_callback1,bouncetime=100)

def demo_callback1(pin):
    print("---- Knopje gedrukt ----")
    GPIO.output(buzzer, GPIO.HIGH)
    sleep(1)
    GPIO.output(buzzer, GPIO.LOW)

try:
    setup()
    while True:
        # print("Hold a tag near the reader")
        # id, text = reader.read()
        # print(id)
        # GPIO.output(buzzer, GPIO.HIGH)
        # sleep(3)
        # GPIO.output(buzzer, GPIO.LOW)
        sleep(1)

finally:
    GPIO.cleanup()