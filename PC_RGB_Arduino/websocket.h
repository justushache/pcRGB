
#include <WiFi.h>
#include <WebSocketsServer.h>


const char* ssid = "ssid";
const char* pwd = "pwd";
int clients = 0;
bool setupMode = false;
bool wsError = false;

WebSocketsServer ws = WebSocketsServer(80);

void onWSEvent(uint8_t num, WStype_t type, uint8_t * payload, size_t length){
    switch(type){
      case WStype_DISCONNECTED:{
      Serial.print(num);Serial.println(" Disconnected!\n");
      clients--;
      if(clients == 0){
      setupMode = false;}
      }
      break;
 
    // New client has connected
    case WStype_CONNECTED:
      
      {
        IPAddress ip = ws.remoteIP(num);
        Serial.print(num);Serial.print(" Connection from :");
        Serial.println(ip.toString());
        clients++;
        setupMode = true;
      }
      break;
 
    // Echo text message back to client
    case WStype_TEXT:{
      char * pay = reinterpret_cast< char *>(payload);
      Serial.printf("TEXT MESSAGE:%s%i",pay);
          Serial.println("formatting SPIFFS");
          SPIFFS.format();
          Serial.println("formatted");
          ws.sendTXT(num, "Finished");
      }      
      break;
 
    // For everything else: do nothing
    case WStype_BIN:// the first two bytes are the frame Count (which frame is transmitted) //the next byte is the pin
      {
      Serial.print("BIN MESSAGE:");
      Serial.println(length);
      if(length < 3){
        return;
       }
      uint16_t frameCount;
      uint8_t pin;
      frameCount = payload[0] << 8;
      frameCount += payload[1];
      pin = payload[2];
      
      char fCString[50];//file name
       sprintf(fCString, "/%i/%i", pin, frameCount); 
      Serial.println(pin);
      Serial.println(fCString);
      for(int i = 3; i < length; i++){
        Serial.println(payload[i]);
        }

      std::vector<uint8_t> writeBuffer{payload+3, payload+length};
      
      writeFile(SPIFFS,fCString,writeBuffer.data(),length);
      ws.sendTXT(num, "Finished");
      }
        break;
        
        
    case WStype_ERROR:
    case WStype_FRAGMENT_TEXT_START:
    case WStype_FRAGMENT_BIN_START:
    case WStype_FRAGMENT:
    case WStype_FRAGMENT_FIN:
    default:
      break;
      }
  
  
  }


void socketSetup(){
    Serial.println("connecting");
    while (WiFi.waitForConnectResult() != WL_CONNECTED){
      WiFi.begin(ssid,pwd);
      delay(1000);
      Serial.println(WiFi.status());
      };
    Serial.println('connected');
    Serial.println('my ip:');
    Serial.println(WiFi.localIP());

    ws.begin();
    ws.onEvent(onWSEvent);
  }

void socketLoop(){
    ws.loop();
    }
  
