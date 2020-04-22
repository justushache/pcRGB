
/* You only need to format SPIFFS the first time you run a
   test or else use the SPIFFS plugin to create a partition
   https://github.com/me-no-dev/arduino-esp32fs-plugin */
#define FORMAT_SPIFFS_IF_FAILED true

int readFile(fs::FS &fs, const char * path,uint8_t * buf, size_t size){
    File file = fs.open(path);
    if(!file ){
        Serial.print("404 File Not Found: ");Serial.print(path);
        return false;
      }
    if(file.isDirectory()){
        Serial.print("File is a Directory: ");Serial.print(path);
        return false;
    }
    return file.read(buf, size);
}

bool FileExists(fs::FS &fs, const char * path){
  
    File file = fs.open(path);
    if(!file|| file.isDirectory()){
      return false;
    }
      return true;
 }

void writeFile(fs::FS &fs, const char * path, const uint8_t * message, size_t length){
  Serial.println("writing:");
    for(int i = 0 ; i < length;i++){
      Serial.println(message[i]);
      }
  Serial.println(".......................");
    File file = fs.open(path, FILE_WRITE);
    if(!file){
        Serial.println("- failed to open file for writing");
        return;
    }
    if(file.write(message,length)){
        Serial.println("- file written");
    } else {
        Serial.println("- frite failed");
    }
}

void appendFile(fs::FS &fs, const char * path, const char * message){
    Serial.printf("Appending to file: %s\r\n", path);

    File file = fs.open(path, FILE_APPEND);
    if(!file){
        Serial.println("- failed to open file for appending");
        return;
    }
    if(file.print(message)){
        Serial.println("- message appended");
    } else {
        Serial.println("- append failed");
    }
}

void renameFile(fs::FS &fs, const char * path1, const char * path2){
    Serial.printf("Renaming file %s to %s\r\n", path1, path2);
    if (fs.rename(path1, path2)) {
        Serial.println("- file renamed");
    } else {
        Serial.println("- rename failed");
    }
}

void deleteFile(fs::FS &fs, const char * path){
    Serial.printf("Deleting file: %s\r\n", path);
    if(fs.remove(path)){
        Serial.println("- file deleted");
    } else {
        Serial.println("- delete failed");
    }
}

void listAllFiles(){
 
  File root = SPIFFS.open("/");
 
  File file = root.openNextFile();
 
  while(file){
 
      Serial.print("FILE: ");
      Serial.println(file.name());
 
      file = root.openNextFile();
  }
 
}

void spiffsSetup(){
    if(!SPIFFS.begin(FORMAT_SPIFFS_IF_FAILED)){
        Serial.println("SPIFFS Mount Failed");
        while(true);
    }    
}
