var exportConnList
var exportUrl
var mCount = 0 // how many messages have been sent
var connCount = 0 // how often a reconect was tried


function initWS(connectionList){
    if(connectionList.length == 0){
      hideProgressBar();
      alert("you need an object to export")
      return;
    }
    exportConnList = connectionList;
    exportUrl = prompt("ip of the esp32")
    try{
      ws = new WebSocket("ws:"+exportUrl);
    }catch(err){
      hideProgressBar();
      alert("this ip is not valid")
      return
    }
    ws.onopen = onOpen
    ws.onmessage = onMessage
    ws.onclose = onClose
    showProgressBar()
  }
  
  function getRawUint8Arr(pin, frame){
    
    var lights = 0
    
    if(exportConnList.length==0||pin > exportConnList.length-1){
      return false;
    }
	for(let j = 0; j < exportConnList[pin].length;j++){
        lights =  lights * 1 + exportConnList[pin][j].ledCount * 1;
        }
    
    let msgBuff = new ArrayBuffer(lights*3+3)
    
    let uint8Arr = new Uint8Array(msgBuff);
    uint8Arr[0] = frame >> 8
    uint8Arr[1] = frame & 0xff
    uint8Arr[2] = pin
    var pos = 3;
    for(let j = 0; j < exportConnList[pin].length;j++){
        l = exportConnList[pin][j];
        for(let k = 0; k < l.ledCount;k++){
          c = l.getLightColor(k,frame);
          uint8Arr[pos]=Math.ceil(red(c)*alpha(c)/255);
          uint8Arr[pos+1]=Math.ceil(green(c)*alpha(c)/255);
          uint8Arr[pos+2]=Math.ceil(blue(c)*alpha(c)/255);
          pos+=3;
        }}
	return msgBuff;
  }
  
  
  function sendMessage(){
	 do{
	 msgBuff = getRawUint8Arr(mCount%7,Math.floor(mCount/7))
	 mCount++;
	 }while(msgBuff==false)
	console.log(msgBuff)
    ws.send(msgBuff)
    console.log("sent message")
    updateProgressBar(Math.round(mCount/7)/10)
  }
  
  function onMessage(evt){ //used as ack
    if(mCount < 7 * 1000 -2){
      sendMessage();
    }
  }
  
  function onOpen(){
    if (confirm("Format Controller?")) {
      ws.send("f")
    } else{
    sendMessage();
  }
    connCount = 0
  }
  
  function onClose(){
    if(connCount < 4){
    ws = new WebSocket(exportUrl);
    ws.onopen = onOpen
    ws.onmessage = onMessage
    ws.onclose = onClose
    connCount++;
    }
    hideProgressBar();
  }

  function showProgressBar(){
    let overlay = document.getElementById("overlay")
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild)
    }
    let bar = document.createElement("div")
    bar.id = "Bar"
    bar.style.textAlign = "center"
    bar.innerHTML = "0%"
    overlay.appendChild(bar);
    overlay.style.display = "block";
  }

  function updateProgressBar(percent){
    let overlay = document.getElementById("overlay")
    if(overlay.style.display == "none"){
      overlay.style.display = "block"
    }
    let bar = document.getElementById("Bar")
    bar.style.width = width * 0.0064 *percent+"px"
    bar.style.backgroundColor = "#e67e22"
    bar.innerHTML = percent + "%"  
  }
  
  function hideProgressBar(){
    let overlay = document.getElementById("overlay")
    overlay.style.display = "none";
  }
