from time import sleep,time
from RPi import GPIO

din = 12

def setup():
    print("setup")
    GPIO.setwarnings(False)
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(din, GPIO.OUT)

def send_data_24bits(data):
    print("send_data_24bits")
    for i in range(24):
        bit = (data >> i) & 1
        if bit == 1:
            GPIO.output(din, GPIO.HIGH)
            sleep(0.00008) # 80us
            GPIO.output(din, GPIO.LOW)
            sleep(0.000045) # 45us
        else:
            GPIO.output(din, GPIO.HIGH)
            sleep(0.00004) # 40us
            GPIO.output(din, GPIO.LOW)
            sleep(0.000085) # 85us
        
def send_8pixel():
    for i in range(8):
        send_data_24bits(0xff0000)

try:
    setup()

    while True:
        send_8pixel()
        sleep(1)
        
except KeyboardInterrupt as e:
    print(e)
    #pass
finally:
    GPIO.cleanup()