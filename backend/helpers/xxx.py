from time import sleep,time
from RPi import GPIO

# weight sensor
class xxx:

    def __init__(self,dout_pin,sck_pin) -> None:
        self.dout = dout_pin
        self.sck = sck_pin
        self.__setup_gpio()
        self.ratio = 0
        self.sample = 0

    def __setup_gpio(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.sck, GPIO.OUT)

    def twos_complement(self, data_in):
         # 0b1000 0000 0000 0000 0000 0000 check if the sign bit is 1. Negative number.
        if (data_in & 0x800000):
            signed_data = -(
                (data_in ^ 0xffffff) + 1)  # convert from 2's complement to int
        else:  # else do not do anything the value is positive number
            signed_data = data_in
        return signed_data


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
        # count = self.twos_complement(count)

        #time.sleep(0.001)
        GPIO.output(self.sck,0)
        # print(count)
        sleep(0.01)
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
    
    def get_weight(self):
        result = self.__read_count_mean(30)
        gram=(result-self.sample)/self.ratio
        # if gram < 0:
        #     gram = 0
        return round(gram*1000)
    
    def get_w(self):
        result = self.__read_count_mean(30)
        gram=(result-self.sample)/106
        return gram
    
    def get_sample(self):
        print('printing sample ....')
        return self.__read_count_mean(30)

    def __get_data_mean(self,amount=30):
        result = self.__read_count_mean(amount)
        return result - self.sample

    def get_ratio(self):
        input('Put a known weight and press Enter: ')
        result = self.__get_data_mean()
        known_weight_grams = int(input('Write how many grams it was and press Enter: '))
        print('printing ratio ....')
        ratio = round(result / known_weight_grams)
        return ratio
    
    def set_ratio(self,ratio):
        self.ratio = ratio
    
    def set_sample(self,sample):
        self.sample = sample