# PC-RGB
a open source WiFi-RGB controller for PC-cases

My PC has ARGB-LEDs (also called Neopixel) in it. But as far as I know there aren't any RGB controllers, which have the ability to apply lighting effects, depending on, where the individual LEDs are placed. That is, why I made this controller, which costs under 10 Euro to make. 

The main advantage of it is, that light effects can be applied depending, on where the RGB - fan or - lightstrip is and for each light object, independent of what the other RGB-objects show. 

One lighting mode for example is vertical rainbow, which basically shows a rainbow-wave from the top of the case to the bottom, so LEDs, which are placed at the same height, show the same color.

## Hardware:
### Needed(absolute minimum config, not recommended):
  - an ESP32
  - some wires
  
### Recommended :
  - some kind of PCB or breadboard 
  - ideally an level shifter (ESP signals are 3.3V, Neopixel need 5V, but work with, a bit of noise, also at 3.3V)
  - female SATA or PATA power connector (it is absolutely not recommended to power the LEDs from USB, it kinda works, but might destroy the USB on your PC)

## Installation
The software consists of the backend, which is an ESP32 and the frontend, which is a web app.
### Frontend
the frontend is also available at http://themetzler.de/PC_RGB/, but if you want to install it anyway:

clone the repo 
```
git clone https://github.com/justushache/pcRGB.git
```
move the contents of PC_RGB_Web to a server and open the address of the server

### Backend
##### you need to install the ESP32 to the Arduiono IDE:
https://randomnerdtutorials.com/installing-the-esp32-board-in-arduino-ide-windows-instructions/
##### you need to install the following libraries into the Arduino IDE:
 - https://github.com/Links2004/arduinoWebSockets
 - https://github.com/FastLED/FastLED
 
after that:
 - Open the PC_RGB_Arduino.ino in the PC_RGB_Arduino folder.
 - Go to the websocket.h file and change the ssid and pwd Strings to the Name and password of your WIFI.
 - Upload it and open the serial monitor.
 - Note the IP, which is displayed in the serial monitor, you need to enter it, when you export the data from the website to the esp.


  

