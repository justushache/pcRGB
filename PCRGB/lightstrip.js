class Lightstrip extends LightObject{
  constructor(pt1, pt2, ledCount,id, plane) {
    super(ledCount,id, plane.normalize())
    this.pt1 = pt1
    this.pt2 = pt2
    this.v = p5.Vector.sub(this.pt2, this.pt1).div(this.lights.length - 1)
  }


  draw() {
    stroke(this.color)
    strokeWeight(4)
    beginShape()
    vertex(this.pt1.x, this.pt1.y, this.pt1.z)
    vertex(this.pt2.x, this.pt2.y, this.pt2.z)
    endShape()
    noStroke()


        for (let i = 0; i < this.lights.length; i++) {
          let p = this.getLightPosition(i)
          fill(this.getLightColor(i,frameCount))
          push()
          translate(p)
          sphere(5)
          pop()
        }
          
    colorMode(RGB)

    strokeWeight(4)
    this.drawText()
  }
  


  setCursorPoint(cp) {
    colorMode(RGB)
    this.cp = cp
    let dis = p5.Vector.sub(this.pt1, cp).cross(this.v).mag() / this.v.mag()
    if (dis < 30) {
      this.color = color(255, 0, 0)
      return true;
    } else {
      this.color = color(0, 0, 0)
      return false;
    }
  }

  getType(){
    return "lightstrip"
  }
  
  getAnimationModes(){
  let modes = ["rainbow - vertical","breathing","none"]
  return modes
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
  
  getLightPosition(index){
          return p5.Vector.add(this.pt1, p5.Vector.mult(this.v, index))
  }
  
   getLightColor(index,frame){ // returns the color, which shall be displayed for the specified light
    if(this.lights[index]){
      return this.lights[index]
    }
    let c 
    switch (this.animation) {
      case ("rainbow - vertical"):
        colorMode(HSB, 100);
        c = color((this.getLightPosition(index).y/10 +  (1000000-frame)*this.speed/100) % 100, 100, 100)
        break;
      case("breathing"):
        colorMode(RGB,255)
        c = color(this.lColor)
        c.setAlpha((sin(frame*this.speed/1000)+1)*125)
    }
    return c  
  }
  
  drawText(){
    push()
    fill(50,50,255)
    textFont(font)
    textSize(60)
    textAlign(CENTER,CENTER)
        
    translate(this.pt1.copy().add(this.plane.copy().mult(10)).add(this.v.copy().mult(this.ledCount/2)))
    let sV = createVector(0,0,1)
    if(this.plane.x !=0||this.plane.y!=0)
    rotate(sV.angleBetween(this.plane),p5.Vector.cross(this.plane, sV))
    text(this.id,0,0)
    pop()
  }
  
  toJSON(){
    return '{' +
    super.toJSON()+
  '"pt1":['     + this.pt1.x + ',' + this.pt1.y + ',' + this.pt1.z + "]," +
  '"pt2":['     + this.pt2.x + ',' + this.pt2.y + ',' + this.pt2.z + "]," +
  '"ledCount":' + JSON.stringify(this.ledCount) + "," +
  '"id":'       + JSON.stringify(this.id) + "," +
  '"plane":['   + this.plane.x + ',' + this.plane.y + ',' + this.plane.z + "]" +
  "}" 
  }
  superFromJSON(json){
    super.fromJSON(json)
  }
  static fromJSON(json){
    let pt1 = createVector(json.pt1[0],json.pt1[1],json.pt1[2])  
    let pt2 = createVector(json.pt2[0],json.pt2[1],json.pt2[2])  
    let plane = createVector(json.plane[0],json.plane[1],json.plane[2])
    let strip = new Lightstrip (pt1,  pt2, json.ledCount, json.id, plane)
    strip.superFromJSON(json)
    return strip
  }
}