from time import sleep,time
from RPi import GPIO

# weight sensor
class HX711:

    def __init__(self,dout_pin,sck_pin) -> None:
        self.dout = dout_pin
        self.sck = sck_pin
        self.__setup_gpio()

    def __setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.sck, GPIO.OUT)

    def __read_count(self):
        i=0
        count=0
        # print count
        # time.sleep(0.001)
        GPIO.setup(self.dout, GPIO.OUT)
        GPIO.output(self.dout,1)
        GPIO.output(self.sck,0)
        GPIO.setup(self.dout, GPIO.IN)
        while GPIO.input(self.dout) == 1:
            wait='waiting'
        for i in range(24):
            GPIO.output(self.sck,1)
            count=count<<1
            GPIO.output(self.sck,0)
            #time.sleep(0.001)
            if GPIO.input(self.dout) == 0: 
                count=count+1
                #print Count

        GPIO.output(self.sck,1)
        count=count^0x800000 # flip the 24th bit 
        #time.sleep(0.001)
        GPIO.output(self.sck,0)
        return count
    
    def __read_count_mean(self,amount=30):
        sum = 0
        counter = 0
        while amount > counter:
            data = self.__read_count()
            # min 0x800000, max 0x7fffff
            if data < 0x7fffff or data > 0x800000:
                sum += data
                counter += 1
        return round(sum/amount)
    
    def get_weight(self, sample):
        count = self.__read_count_mean(100)
        gram=(count-sample)/106
        if gram < 0:
            gram = 0
        return round(gram)
    
    def get_sample(self):
        print('printing sample ....')
        return self.__read_count_mean(100)