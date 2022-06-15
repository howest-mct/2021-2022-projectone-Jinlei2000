# Project one

## Table of Contents

1. [About Smart garbage](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#about-smart-garbage)
   - [Sensors/Actuators](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#sensorsactuators)
   - [Feature on site](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#feature-on-site)
2. [Technologies](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#technologies)
3. [Getting Started](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#getting-started)
4. [Instructables](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#instructables)
5. [Contact](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#contact)
6. [Acknowledgments](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/readme.md#acknowledgments)

## About Smart Garbage

I am an MCT student from Howest in Kortrijk, Belgium.

My project is a **Smart garbage** using a Raspberry Pi. Its purpose is to easily keep **track of how much trash is produced** over a period of time. When the bin is full, the garbage collector can be notified.

The smart trash can is intended for city staff/businesses who can efficiently empty their trash cans because they can see which trash cans are full.

**Green city, clean city, my dream city. Keep track of your consumed waste with Smart Garbage.**

### Sensors/Actuators

These are all my used sensors and actuators:

- **Weight sensor** to measure weight.
- **Ultrasonic sensor** determines the volume.
- **Badge reader** opens the door.
- **2 servomotors** can lock the valve and door.
- **Rgb LEDs** shows the volume value.
- **Magnet contacts** keeps track of the status of the door and valve.
- **LCD display** to see the ip address.
- **Buttons** one to shut down raspberry pi and other to turn on the lcd.

### Feature on site

- Https website
- Create an account (must have a badge to create an account).
- Login
- Token Authentication
- Delete account
- Changing theme color
- There is live, average and total data (can filter by time).
- Changing location.
- Charts that can be filtered with time.
- Map where you can see current location and smart garbage location.
- History table can be filtered with time. (there is also a search bar)
- 2 buttons one to shut down raspberry pi and other to open the door.

## Technologies

These are all used programming languages and libraries.

- [Python](https://www.python.org/)
- HTML
- Javascript
- [Flask](https://flask.palletsprojects.com/en/2.1.x/)
- [JSON Web Token](https://jwt.io/)
- [Socketio](https://python-socketio.readthedocs.io/en/latest/)
- [Datatables](https://datatables.net/)
- [Chart.js](https://www.chartjs.org/)
- [Goapify](https://www.geoapify.com/)

## Getting Started

### Setting Up the Raspberry Pi

Before we can run the code we are going to prepare the raspberry pi.

1. Downloading Raspberry Pi OS.\
   Go to [Raspberry Pi OS](https://www.raspberrypi.com/software/operating-systems/) and download image --> (Raspberry Pi OS with desktop). This may take a while.

2. Writing image to your SD Card.\
   When it is finished downloading, you can write the image to your sd card with (recommend 8 or 16GB) [Win32 Disk Imager](https://sourceforge.net/projects/win32diskimager/). How to do this? [Tutorial Video](https://youtu.be/D2TISpT7yLI?t=115)

3. Configuring the SD Card.
   When writing is done, we can start setting up the SD Card.

- Open file explorer.
- Go to my pc --> find **boot** disk
- Create a new file **ssh** without extension.
- Open the file **cmdline.txt** with [Notepad++](https://notepad-plus-plus.org/downloads/).
- Add 'ip=169.254.10.1' to the end of the file and save it.

4. Starting the Raspberry Pi.

- Connect an internet cable from your PC to your Pi
- Open [Putty](https://www.putty.org/).
- Choose port **22** and enter the ip address of your Pi **169.254.10.1** and connection type **SSH**.
- Enter login **pi** and the password **raspberry**.
- if you get a warning message, click **Yes**.

5. Some configuration.\
   Enable I2C and SPI on the Raspberry Pi with: `sudo raspi-config`.\
   Choose **Interface Options** and enable (I2C and SPI).
   Navigate to **Localisation Options** --> change timezone and WLAN Country.\
   Then reboot the Pi.

6. Adding WiFi.\
   Adding your own home wifi.
   ```bash
   sudo wpa_passphrase 'Networkname' 'Password' >> /etc/wpa_supplicant wpa_supplicant.conf
   ```
   Reload your wireless network card in the PI.
   ```bash
   wpa_cli -i wlan0 reconfigure
   ```
   You can now check the connection by requesting the ip-address (wlan0).
   ```bash
   ifconfig
   ```
7. Installing some packages.\
   Stay up to date with the latest version.

   ```bash
   sudo apt update
   sudo apt upgrade
   ```

   Install the following packages and libraries for python:

   ```bash
   sudo pip install flask-cors
   sudo pip install flask-socketio
   sudo pip install simple-websocket
   sudo pip install mysql-connector-python
   sudo pip install gevent
   sudo pip install gevent-websocket
   sudo pip install selenium
   sudo apt install chromium-chromedriver
   sudo pip3 install rpi_ws281x adafruit-circuitpython-neopixel
   sudo python3 -m pip install --force-reinstall adafruit-blinka
   sudo apt install python3-dev python3-pip
   sudo pip3 install mfrc522
   ```

   Now reboot the Pi.

   ```bash
   sudo reboot
   ```

8. Get github code.\
   Clone the github repository.

   ```bash
   git clone https://github.com/howest-mct/2021-2022-projectone-Jinlei2000
   ```

9. Database\
   Install MariaDB and configuration.

   ```bash
   sudo apt install mariadb-server mariadb-client -y
   ```

   Securing the database.

   ```bash
   sudo mysql_secure_installation
   ```

   Enter > Type a password (**remember**) > y > y > y > y
   Create a user on the database.

   ```bash
   sudo mysql -u root -p
   create user 'USERNAME'@'localhost' identified by 'USERNAME';
   grant all privileges on *.* to USERNAME@localhost;
   flush privileges;
   exit;
   ```

   Make a new connection on [MySQLWorkBench](https://www.mysql.com/products/workbench/)

   - Open MySQL WorkBench and make a new connection.
   - Connection Method --> Standard TCP/IP over SSH.
   - SSH Hostname: 192.168.168.169
   - SSH Username: pi
   - SSH Password: raspberry
   - MySQL Hostname: 127.0.0.1
   - MySQL Server Port: 3306
   - Username: USERNAME
   - Password: PASSWORD
<br><br>
10. Apache\
   Install Apache and configuration.

      ```bash
      sudo apt install apache2
      ```
      Some plugins:

      ```bash
      sudo a2enmod proxy_http
      sudo a2enmod rewrite
      sudo a2enmod ssl
      ```

      Follow this link to configure Self Signed Certificate for https: [Tutorial](https://peppe8o.com/self-signed-certificate-https-in-raspberry-pi-with-apache/)
      Change some configurations.

      ```bash
      nano /etc/apache2/sites-available/000-default.conf
      ```

      Replace the following lines with the following lines and change DocumentRoot to the path of your project (SAVE: CTRL + X > Y > Enter):

      Go to [GitHub](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/apache%20file.txt) copy apache file

      Now restart the Apache.

      ```bash
      sudo systemctl restart apache2
      ```

      check the status of Apache.

      ```bash
      sudo systemctl status apache2
      ```

      ```bash
      Loaded: loaded (/lib/systemd/system/apache2.service; enabled; vendor preset:
      enabled)
      Active: active (running) since ...
      ```

11. Run the server.\
    Last things to be done.
    Go to [Geoapify](https://www.geoapify.com/tutorial/how-to-implement-geocoding-javascript-tutorial) create account and make a new project. Now copy the API key. Then go to the project directory on the PI (frontend > script > dashboard.js > line 371) and paste the API key.

      Ready to run everything :satisfied:.

      ```bash
      sudo /bin/python3 <project_directory>/backend/app.py
      ```

12. Automatic starting of the software (services).\
   If you follow this your raspberry pi is booting your software will start automatically. I have 2 files that need to be started. One is [app.py](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/backend/app.py) and other is [powerbtn.py](https://github.com/howest-mct/2021-2022-projectone-Jinlei2000/blob/master/backend/powerbtn.py).

   Create the file and put the contents of the following lines in it:
   ```bash	
   nano /etc/systemd/system/smartgarbage.service
   ```
   **Don't forget** to replace the placeholders with the correct directory (ExecStart, WorkingDirectory)!
   ```bash	
   [Unit]
   Description=smartgarbage
   After=network.target
   [Service]
   ExecStart==/usr/bin/python3 -u /home/student/2021-2022-projectone-Jinlei2000/backend/app.py
   WorkingDirectory=/home/student/2021-2022-projectone-Jinlei2000/backend
   StandardOutput=inherit
   StandardError=inherit
   Restart=always
   User=root
   [Install]
   WantedBy=multi-user.target
   ```
   Save the file (CTRL + X > Y).
   Now we are going to create the second service for the powerbtn.py
   ```bash	
   nano /etc/systemd/system/powerbtn.service
   ```
   **Don't forget** to replace the placeholders with the correct directory (ExecStart, WorkingDirectory)!
   ```bash	
   [Unit]
   Description=powerbtn
   After=network.target
   [Service]
   ExecStart==/usr/bin/python3 -u /home/student/2021-2022-projectone-Jinlei2000/backend/powerbtn.py
   WorkingDirectory=/home/student/2021-2022-projectone-Jinlei2000/backend
   StandardOutput=inherit
   StandardError=inherit
   Restart=always
   User=root
   [Install]
   WantedBy=multi-user.target
   ```
   Notify the system of the new service Next, inform the system that the new service should be active.
   ```bash	
   sudo systemctl enable powerbtn.service
   ```	
   Restart the system.
   ```bash
   sudo reboot
   ```	
   You can now use the power button to turn the app.py script on or off. If you hold the power button longer than 6 seconds the raspberry pi will shutdown.





### The circuit diagram

We are going to connect the circuit of the Smart garbage. go to [instructables]() link!!!! to see the scheme for more detail.

## Instructables

If you want to recreate my project you will find a well-documented guide on [instructables](https://www.instructables.com/preview/EZKOKHRL20FZQ8B/).link aaanpassss!!!!!

## Contact

Lei Jin - [lei.jin@student.howest.be](mailto:lei.jin@student.howest.be)

Source code: https://github.com/howest-mct/2021-2022-projectone-Jinlei2000

## Acknowledgments

- [Line awesome](https://icons8.com/line-awesome)
- [Inter webfonts](https://rsms.me/inter/)


