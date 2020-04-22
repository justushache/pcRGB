  
#define NUM_LEDS 117
#define FRAMERATE 30

  #include "FS.h"
  #include "SPIFFS.h"
  #include "FastLED.h"
  #include "mem.h"
  #include "websocket.h"
  #include "WebServer.h"
  #include "Wifi.h"

CRGB leds[8][NUM_LEDS];
uint8_t gBrightness = 255;
int frameCount = 0;
int co = 0 ;
WebServer server(80);
TaskHandle_t WSLoop;
int maxPin = 7;

void setup() { 
  Serial.begin(115200);
  spiffsSetup();
  // the pins are 12,14,27,26,25,33,32,35
  FastLED.addLeds<NEOPIXEL,32>(leds[0], NUM_LEDS);
  FastLED.addLeds<NEOPIXEL,33>(leds[1], NUM_LEDS);
  FastLED.addLeds<NEOPIXEL,25>(leds[2], NUM_LEDS);
  FastLED.addLeds<NEOPIXEL,26>(leds[3], NUM_LEDS);
  FastLED.addLeds<NEOPIXEL,27>(leds[4], NUM_LEDS);
  FastLED.addLeds<NEOPIXEL,14>(leds[5], NUM_LEDS);
  FastLED.addLeds<NEOPIXEL,12>(leds[6], NUM_LEDS);
//  FastLED.addLeds<NEOPIXEL,35>(leds[7], NUM_LEDS);

  socketSetup();
  Serial.println("Files in SPIFFS");
  listAllFiles();
  Serial.println("---------------");
  Serial.println(xPortGetCoreID());
    xTaskCreatePinnedToCore(
      display, /* Function to implement the task */
      "Task1", /* Name of the task */
      10000,  /* Stack size in words */
      NULL,  /* Task input parameter */
      0,  /* Priority of the task */
      &WSLoop,  /* Task handle. */
      0);
}

void getLEDs(int pin, int frame, CRGB* arr){
    uint8_t buffer[NUM_LEDS*3+3];
    char path[50];
    sprintf(path, "/%i/%i", pin, frame);
    int length = readFile(SPIFFS, path,buffer,NUM_LEDS*3+3);
    if(!length){
      if(pin == 0 || frameCount > 1000){
        frameCount = 0;
        Serial.print("reset Framecount at frame: ");Serial.print(frame);Serial.print("and pin: ");Serial.println(pin);
      }else {
           maxPin = pin;       
        }
      return;
      }
    for(int i = 0; i < length/3; i++){
        arr[i]=CRGB(buffer[i*3],buffer[i*3+1],buffer[i*3+2]);
      }
  }

void display(void * arg){
  TickType_t lastTime = xTaskGetTickCount();
  while(true){
    if(!setupMode){
    int starttime = micros();
    for(int i =0; i < maxPin;i++){
      getLEDs(i,frameCount,leds[i]);
    }
    frameCount++;
    FastLED.show();
    }
    vTaskDelayUntil(&lastTime, 1000/FRAMERATE/portTICK_RATE_MS);
  }
  }

void loop() {
  if(!wsError){
    socketLoop();
  }
}
