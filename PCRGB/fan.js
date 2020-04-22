class Fan extends LightObject{
  constructor(pos,  r, ledCount,id,plane) {
    super(ledCount,id,plane)    
    this.pos = pos
    this.r = r
    this.plane = plane.normalize()    
  
    if(this.plane.x == 0){
      this.u = createVector(1,0,0)
    }else{
      this.u = createVector(-(this.plane.z+this.plane.y)/this.plane.x,1,1)
    }
    this.u.normalize().mult(this.r)
    
    //v is orthogonal to n and u
    this.v = this.plane.copy().cross(this.u)
    this.v.normalize().mult(this.r)
  }
  
  draw() {
    let n = this.plane
    n.normalize()
    
    colorMode(HSB,100)
    stroke(0)
    strokeWeight(4)
    beginShape()
    for(let i = 0; i<this.ledCount; i++){
      let p = this.getLightPosition(i)
      vertex(p.x,p.y,p.z)  
      push()
      noStroke();
      fill(this.getLightColor(i,frameCount))
      translate(p)
      sphere(5)
      stroke(3)
      pop()
    }
    fill(this.bgcolor)
    
    endShape(CLOSE)
    noStroke()

    colorMode(RGB)
    
    strokeWeight(4)
    this.drawText()

  }
  
  setCursorPoint(cp){
    this.cp = cp    
    
    colorMode(HSB,100)
    if(this.cp&&this.pos.dist(this.cp)<this.r){
    this.bgcolor = color(100,255,255)
    return true;
    }
    else
    {
    this.bgcolor = color(50,10) 
    return false;
    }
  }

  getType(){
    return "fan"
  }

  getAnimationModes(){
    let modes = ["rainbow - vertical","rainbow - circular","breathing","none"]
    return modes
  }
    
  getLightPosition(index){
    let angle = TWO_PI/(this.ledCount)*index
    let x = this.pos.x + this.v.x*sin(angle) + this.u.x*cos(angle)+this.plane.x
    let y = this.pos.y + this.v.y*sin(angle) + this.u.y*cos(angle)+this.plane.y
    let z = this.pos.z + this.v.z*sin(angle) + this.u.z*cos(angle)+this.plane.z
    return createVector(x,y,z)
  }
    
  getClosestLed(cp){//returns the closest LED
    let minD = Infinity
    let index = false
    for(let i=0; i < this.ledCount;i++){
      let d = p5.Vector.sub(this.getLightPosition(i),cp).mag()
      if(d<minD){
        minD = d 
        index = i
      }
    }
    return [index,minD]//return index and distance
  }
    
   getLightColor(index,frame){ // returns the color, which should be displayed for the specified light
    if(this.lights[index]){
      return this.lights[index]
    }
    let c = this.lColor
    switch(this.animation){
      case ("rainbow - vertical"):
        colorMode(HSB, 100);
        c = color((this.getLightPosition(index).y/10 +  (1000000-frame)*this.speed/100) % 100, 100, 100)
        break;
      case "rainbow - circular":
        colorMode(HSB,100)
        c = color((index/this.lights.length*100+frame*this.speed/100)%100,100,100)
        break
      case "breathing":
        colorMode(RGB,255)
        c = color(this.lColor)
        c.setAlpha((sin(frame*this.speed/1000)+1)*125)
        break
    }
        return c;
  }
    
  drawText(){
    push()
    fill(50,50,255)
    textFont(font)
    textSize(60)
    textAlign(CENTER,CENTER)
    
    translate(this.pos.copy().add(this.plane.mult(10)))
    let sV = createVector(0,0,1)
    if(this.plane.x !=0||this.plane.y!=0)
    rotate(sV.angleBetween(this.plane),p5.Vector.cross(this.plane, sV))
    text(this.id,0,0)
    pop()
  }
  toJSON(){
    return '{' +
    super.toJSON()+
  '"pos":['     + this.pos.x + ',' + this.pos.y + ',' + this.pos.z + "]," +
  '"r":'        + JSON.stringify(this.r) + "," +
  '"ledCount":' + JSON.stringify(this.ledCount) + "," +
  '"id":'       + JSON.stringify(this.id) + "," +
  '"plane":['   + this.plane.x + ',' + this.plane.y + ',' + this.plane.z + "]" +
  "}" 
  }
  superFromJSON(json){
    super.fromJSON(json)
  }
  static fromJSON(json){
    let pos = createVector(json.pos[0],json.pos[1],json.pos[2])
    let plane = createVector(json.plane[0],json.plane[1],json.plane[2])

    let fan = new Fan (pos,  json.r, json.ledCount, json.id, plane)
    fan.superFromJSON(json)
    return fan
  }
  
}