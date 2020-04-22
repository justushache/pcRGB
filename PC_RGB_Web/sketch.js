
let camPos
let lastTime, dTime;
let ca, l, ol, lc
let lastP, curP
let DEFAULT_Z;
let selectedLight;// the currently selected light
let lastC // the Light index and Led index to be connected to another one
var font
let lastSidebarValue = '';
let lastLigthstripIndex;
let connectLightstrips = false;
function preload(){
  font = loadFont('OpenSans-Bold.ttf');
  console.log("Hello")
}

function setup() {
  createCanvas(windowWidth*0.8, windowHeight, WEBGL);
  camPos = createVector(0, 0, windowWidth)
  lastTime = millis();

  c = color(30, 30, 30)
  ca = new Case(500, 600, 200, c);
  DEFAULT_Z = height / 2 / tan((30 * PI) / 180);
  //createSidebar()
  ol = new Settings(false);
  con = new Connections()
  selectedLight=false;
  lastC = false;
}

function draw() {
  frameRate(60);
  dt = millis() - lastTime;
  lastTime = millis();
  
  colorMode(RGB)

  background(135,206,250);

  camera(camPos.x, camPos.y, camPos.z, camPos.x, camPos.y, camPos.z - 1000, 0, 1, 0);

  ambientLight(255)
  //ca.lighting() the p5.js lighting system doesn't work with custom Shapes

  keyHandler();
  
    let p = ca.intersection(createVector(mouseX- width / 2, mouseY- height / 2, -DEFAULT_Z), createVector(camPos.x, camPos.y, camPos.z), camPos)
    
  ca.setCursorPoint(p)
  ca.draw();

  ca.setColor(-1,-1, false)
  if(sidebarValue() =="Connect"){
      let c = ca.getClosestLed(p)
      if(lc){
        ca.setColor(c[0],c[1], color(255,0,0))}
      if(lastC){
        ca.setColor(lastC[0],lastC[1], color(0,0,255))
        }
      lc = c
  }
  
if (lastP) {
  push()
  translate(lastP)
  sphere(5)
  pop()
  
  if (p) {// draws a line from the last clicked Point to the cusor, used for lightstrip
    push()
    translate(p)
    sphere(5)
    pop()
    
    stroke(0)
    strokeWeight(4)
    
    beginShape()
     vertex(lastP.x,lastP.y,lastP.z)
      vertex(p.x,p.y,p.z)
    endShape()
  }
}
if(lastSidebarValue!= sidebarValue()){
  onSidebarValueChanged()
}
lastSidebarValue = sidebarValue();
}
  
function onSidebarValueChanged(){
  con.close()
  switch(sidebarValue()){
    case "Export":
      con.show(ca.lightsList)
      initWS(con.createConnList(ca.lightsList));
      break
    case "Load":// Load config from file
      let overlay = document.getElementById("overlay")
      while (overlay.firstChild) {
        overlay.removeChild(overlay.firstChild)
      }
      let input = document.createElement("INPUT");
      input.name = "fileInput"
      input.type = "file"
      input.multiple = "false"
      input.style.visibility  = "visible";
      input.style.left  = "5%";
      input.style.top   = "10%";
      input.style.width = "20%";
      input.addEventListener("input", function(){
        let file = input.files[0];
        file.text().then(function(text){
          ca = Case.fromJSON(text)
          document.getElementById("Fan").checked = true;
        });
      })
      overlay.appendChild(input)
      overlay.style.display = "block";
      break

    case "Save": // Save to file
      var element = document.createElement("a");
      element.style.display = 'none';
      element.setAttribute('href','data:text/plain;charset=utf-8,'+ca.toJSON());
      element.setAttribute('download', "config.cf");
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      break
    case "Connections":
      con.show(ca.lightsList)
      break
    case "":
      break
  
  }
}


function mouseClicked() {

  if(sidebarValue()!="Lightstrip"){
    connectLightstrips = false;
    lastP = false;
  }


  if((mouseX>width||mouseY>height))
    return
  // check where mouse is pointing to 
  
  let p = ca.intersection(createVector(mouseX- width / 2, mouseY- height / 2, -DEFAULT_Z), createVector(camPos.x, camPos.y, camPos.z), camPos)
  if (p) {
    
    if(sidebarValue()=="Delete"){
      let i = ca.setCursorPoint(p)
      if(i){
        ca.deleteLight(i)      
      } 
    }

    
    if(sidebarValue()=="Connect"){
      if(lastC){
        let i = ca.getClosestLed(p)
        if(i){
          ca.connectLights(lastC[0],lastC[1],i[0],i[1])
          lastC = false
          ca.setColor(-1,-1, false)
          alert("connected")
        } 
      }else{
        lastC = ca.getClosestLed(p)  
        ca.setColor(lastC[0],lastC[1], color(255,0,0))
      }
    }
    
    if(sidebarValue()=="Settings"){
      if(!ol.isOpen()){
        let i = ca.setCursorPoint(p)
        if(i){
          selectedLight = i;
          ca.setAnimation(i,"breathing")
          ol.show(ca.getLight(i))
        } 
      }
    }
    
      if(sidebarValue()=="Fan"){
        ledCount = prompt("how many Leds has your rgb-fan")

        let n =  ca.intersectionPlane(createVector(mouseX- width / 2, mouseY- height / 2, -DEFAULT_Z), createVector(camPos.x, camPos.y, camPos.z), camPos).n.copy().normalize()
        
        if(p5.Vector.add(p,n).dist(camPos)>p.dist(camPos)){
          n.mult(-1)
        }
     
        ca.addFan(p,120/2, ledCount,n);
        return;
      }
   
    if(sidebarValue()=="Lightstrip"){
      if (lastP) {
        ledCount = prompt("how many Leds has your lightstrip (part)")
        let n =  ca.intersectionPlane(createVector(mouseX- width / 2, mouseY- height / 2, -DEFAULT_Z), createVector(camPos.x, camPos.y, camPos.z), camPos).n.copy().normalize()
        let currentLigthstripIndex =  ca.addLightstrip(lastP, p, ledCount,n);
        lastP = p;
        if(connectLightstrips){
          ca.connectLights(currentLigthstripIndex,ca.getLight(currentLigthstripIndex), lastLigthstripIndex, 0)
        }
        connectLightstrips = true;
        lastLigthstripIndex = currentLigthstripIndex;
      } else {
        lastP = p;
    }
  }

}
}

function keyHandler() {
  if (keyIsDown(87))
    camPos.z -= dt / 5
  if (keyIsDown(83))
    camPos.z += dt / 5
  if (keyIsDown(65))
    camPos.x -= dt / 5
  if (keyIsDown(68))
    camPos.x += dt / 5
  if (keyIsDown(32))
    camPos.y -= dt / 5
  if (keyIsDown(16))
    camPos.y += dt / 5
}