from ipaddress import ip_address
from smbus import SMBus
from time import sleep
from subprocess import check_output

class Lcd_4bits_i2c:

    def __init__(self,adres) -> None:
        self.adres = adres
        self.i2c = SMBus(1)
        self.i2c.open(1)

    def init_LCD(self):
        # 1) Function set
        self.__send_instruction(0x30)
        sleep(0.02)
        self.__send_instruction(0x30)
        sleep(0.02)
        self.__send_instruction(0x30)
        sleep(0.001)
        self.__set_enable(((0x28 & 0xf0)>>2)) # 4-bit mode eerste keer goed zetten, anders krijg je niets terug.
        self.__send_instruction(0x28)
        # 2) Display on & cursor on & blink on
        self.__send_instruction(0x0C|0x02|0x01)
        # 3) Clear display en cursor home
        self.__send_instruction(0x01)

    def __send_instruction(self,value):
        # print('instruction sturen')
        self.__set_data_bits(value,0)
    
    def __send_character(self,value):
        # print('character sturen')
        self.__set_data_bits(value,1)
    
    def __set_data_bits(self,value,rs):
        hoogste_4bits = ((value & 0xf0)>>2) | rs
        laagste_4bits = ((value & 0x0f)<<2) | rs
        # print('hoogste_4bits: ', hoogste_4bits)
        # print('laagste_4bits: ', laagste_4bits)
        self.__set_enable(hoogste_4bits)
        self.__set_enable(laagste_4bits)
    
    def __set_enable(self,bits):
        e = 2
        self.i2c.write_byte(self.adres, bits | e)
        sleep(0.01)
        self.i2c.write_byte(self.adres, bits & ~e)
        sleep(0.01)

    def __read_ip_adres(self,type_ip):
        lijst = []
        data = check_output(['ifconfig',f'{type_ip}']).decode('utf-8').split('\n')
        # print(data)
        for i in data:
            if 'inet' in i:
                lijst.append(i)
                break
        ip = lijst[0].split()[1]
        # print(ip)
        return ip

    def __write(self,value):
        for karakter in value:
                ascii_waarde = ord(karakter)
                self.__send_character(ascii_waarde)
    
    def write_ip_adres(self,type_ip):
        ip = self.__read_ip_adres(type_ip)
        self.clear_LCD()
        self.curscorOff()
        if type_ip == 'wlan0':
            self.__write('WIFI IP address:')
            self.second_row()
            self.__write(ip)
        elif type_ip == 'eth0':
            self.__write('LAN IP address:')
            self.second_row()
            self.__write(ip)
    
    def write_joystick_waarde(self,positie,waarde):
        cijfers = 1023-waarde
        aantal_blokken = int((16/1023)*cijfers)
        self.clear_LCD()
        if positie == 'x':
            for i in range(aantal_blokken):
                self.__send_character(219)
            self.second_row()
            self.__write(f'VRX => {cijfers}')
        elif positie == 'y':
            for i in range(aantal_blokken):
                self.__send_character(219)
            self.second_row()
            self.__write(f'VRY => {cijfers}')

    def write(self,value):
        self.clear_LCD()
        self.__write(value)

    def get_ip_wlan0(self):
        return self.__read_ip_adres('wlan0')
    
    def second_row(self):
        #Sets DDRAM naar 2de rij
        self.__send_instruction(0xC0)
        
    def clear_LCD(self):
        self.__send_instruction(0x01)

    def close_i2c(self):
        self.i2c.close()
    
    def set_to_8bits(self):
        self.__send_instruction(0x38)
    
    def cursorOn(self):
        self.__send_instruction(0x0C|0x02)

    def curscorOff(self):
        self.__send_instruction(0x0C)

    def curscorBlinkOn(self):
        self.__send_instruction(0x0C|0x01)

    def curscorBlinkOff(self):
        self.__send_instruction(0x0C|0x02)
    
    def __str__(self) -> str:
        return f'i2c bus adres: {self.adres}'