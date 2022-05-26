from random import sample
from time import sleep,time
from RPi import GPIO

dt = 27 #input
sck = 22 #output clock


def setup():
    print('start')
    GPIO.setmode(GPIO.BCM)
    GPIO.setwarnings(False)
    GPIO.setup(sck, GPIO.OUT)

def readCount():
  i=0
  Count=0
 # print Count
 # time.sleep(0.001)
  GPIO.setup(dt, GPIO.OUT)
  GPIO.output(dt,1)
  GPIO.output(sck,0)
  GPIO.setup(dt, GPIO.IN)
  while GPIO.input(dt) == 1:
      wait='waiting'
  for i in range(24):
        GPIO.output(sck,1)
        Count=Count<<1
        GPIO.output(sck,0)
        #time.sleep(0.001)
        if GPIO.input(dt) == 0: 
            Count=Count+1
            #print Count

  GPIO.output(sck,1)
  Count=Count^0x800000
  #time.sleep(0.001)
  GPIO.output(sck,0)
  return Count 

def showWeight():
    count = readCount()
    w=(count-sample)/106
    return w

try:
    setup()
    sample = 1807315

    while True:
        sleep(0.1)
        print('gewicht: ',showWeight())

finally:
    GPIO.cleanup()