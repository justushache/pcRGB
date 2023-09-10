let DEBUG = true //this should only be enabled when testing the application


let camDirTheta = 0 //camera angle polar (up down) 
let camDirPhi       // camera angle (left right)
let camPos, camDir
let lastTime, dTime;
let currentCase, l, ol, lc
let lastP, curP
let DEFAULT_Z;
let selectedLight;// the currently selected light
let lastC // the Light index and Led index to be connected to another one
var font
let lastSidebarValue = '';
let lastLigthstripIndex;
let connectLightstrips = false;

document.oncontextmenu = document.body.oncontextmenu = function() {return false;}

function preload(){
  font = loadFont('OpenSans-Bold.ttf');
  console.log("Hello")
}

function setup() {
  camDirPhi = PI
  camDirTheta = HALF_PI
  createCanvas(windowWidth*0.8, windowHeight, WEBGL);
  camPos = createVector(0, 0, windowWidth/3)
  camDir = createVector(0, 1, 0)
  lastTime = millis();

  c = color(30, 30, 30)
  currentCase = new Case(500, 600, 200, c);
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

  camDir = p5.Vector.fromAngles(camDirTheta,camDirPhi).normalize()

  camera(camPos.x, camPos.y, camPos.z, camPos.x+camDir.x, camPos.y+camDir.y, camPos.z +camDir.z, 0,1,0);

  ambientLight(255)
  //ca.lighting() the p5.js lighting system doesn't work with custom Shapes

  keyHandler();

  //caluclate where the mouse is pointing
  mouseline = calculateMouseLine() // line from camera position through where the mouse is on the screen
  let lineStart = mouseline[0]
  let lineDirection = mouseline[1]

  let p = currentCase.intersection(lineDirection, lineStart, camPos) // intersetion between mouseline and a part of the case
    
  currentCase.setCursorPoint(p)
  currentCase.draw();

  currentCase.setColor(-1,-1, false)
  if(sidebarValue() =="Connect"){
      let c = currentCase.getClosestLed(p)
      if(lc){
        currentCase.setColor(c[0],c[1], color(255,0,0))}
      if(lastC){
        currentCase.setColor(lastC[0],lastC[1], color(0,0,255))
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
      con.show(currentCase.lightsList)
      initWS(con.createConnList(currentCase.lightsList));
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
          currentCase = Case.fromJSON(text)
          document.getElementById("Fan").checked = true;
        });
      })
      overlay.appendChild(input)
      overlay.style.display = "block";
      break

    case "Save": // Save to file
      var element = document.createElement("a");
      element.style.display = 'none';
      element.setAttribute('href','data:text/plain;charset=utf-8,'+currentCase.toJSON());
      element.setAttribute('download', "config.cf");
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      break
    case "Connections":
      con.show(currentCase.lightsList)
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
  

  mouseline = calculateMouseLine()
  let lineStart = mouseline[0]
  let lineDirection = mouseline[1]

  let p = currentCase.intersection(lineDirection, lineStart, camPos)


  //

  
  if (p) { // mouse was clicked and it points to a case Panel
    
    if(sidebarValue()=="Delete"){
      let i = currentCase.setCursorPoint(p)
      if(i){
        currentCase.deleteLight(i)      
      } 
    }

    
    if(sidebarValue()=="Connect"){
      if(lastC){
        let i = currentCase.getClosestLed(p)
        if(i){
          currentCase.connectLights(lastC[0],lastC[1],i[0],i[1])
          lastC = false
          currentCase.setColor(-1,-1, false)
          alert("connected")
        } 
      }else{
        lastC = currentCase.getClosestLed(p)  
        currentCase.setColor(lastC[0],lastC[1], color(255,0,0))
      }
    }
    
    if(sidebarValue()=="Settings"){
      if(!ol.isOpen()){
        let i = currentCase.setCursorPoint(p)
        if(i){
          selectedLight = i;
          currentCase.setAnimation(i,"breathing")
          ol.show(currentCase.getLight(i))
        } 
      }
    }
    
      if(sidebarValue()=="Fan"){
        ledCount = prompt("how many Leds has your rgb-fan")

        let n =  currentCase.intersectionPlane(lineDirection, lineStart, camPos).n.copy().normalize()
        
        if(p5.Vector.add(p,n).dist(camPos)>p.dist(camPos)){
          n.mult(-1)
        }
     
        currentCase.addFan(p,120/2, ledCount,n);
        return;
      }
   
    if(sidebarValue()=="Lightstrip"){
      if (lastP) {
        ledCount = prompt("how many Leds has your lightstrip (part)")
        let n =  currentCase.intersectionPlane(lineDirection, lineStart, camPos).n.copy().normalize()
        let currentLigthstripIndex =  currentCase.addLightstrip(lastP, p, ledCount,n);
        lastP = p;
        if(connectLightstrips){
          currentCase.connectLights(currentLigthstripIndex,currentCase.getLight(currentLigthstripIndex), lastLigthstripIndex, 0)
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
  let up = createVector(0,-1,0)
  left = camDir.cross(up)

  if (keyIsDown(87)) // (fly forward)
    camPos.add(camDir.normalize().mult(dt / 5))
  if (keyIsDown(83)) // (fly back)
  camPos.add(camDir.normalize().mult(-dt / 5))
  if (keyIsDown(65)) // (fly left)
    camPos.add(left.normalize().mult(dt / 5))
  if (keyIsDown(68)) // (fly right)
    camPos.add(left.normalize().mult(-dt / 5))  
  if (keyIsDown(32)) // (fly down)
    camPos.add(up.normalize().mult(dt / 5))
  if (keyIsDown(16)) // S (fly up)
    camPos.add(up.normalize().mult(-dt / 5))

  if (mouseIsPressed === true) {
    if (mouseButton === RIGHT) {
      camDirPhi = camDirPhi - movedX/width*4
      camDirTheta = camDirTheta + movedY/height*4
      if(frameCount%10 == 0 ){
        console.log("/n/n/n/===== theta, x,y,z=====")
        console.log(camDirPhi)
        console.log(camDir.x)
        console.log(camDir.y)
        console.log(camDir.z)
      }
      }
  }
}


function calculateMouseLine(){
  
  //a line from our camera througth the screen, where the mouse is
  //line start is the camera position
  let lineStart = camPos
  //direction is a bit harder, lets first draw our line through the middle of the screen
  let lineDirection = camDir
  //now we need to add the mouse cursor component.

  //when a line is drawn through a point on the screen it has a certain angle to the line throug the middle of the screen. we will divide this angle in phi (x) and theta (y)
  mousePhi = atan((mouseX- width / 2)/-DEFAULT_Z)
  mouseTheta = -atan((mouseY- height / 2)/-DEFAULT_Z)
  
  //create a new direction vector, which adds our mouse phi and theta to the already calculated cam direction phi and theta

  lineDirection = p5.Vector.fromAngles(camDirTheta+mouseTheta,camDirPhi+mousePhi).normalize()

  return [lineStart,lineDirection]
}