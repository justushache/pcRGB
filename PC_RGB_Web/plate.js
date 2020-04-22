class Plate{
  constructor(pt1,pt2,pt3){
    this.pt1 = pt1;
    this.pt2 = pt2;
    this.pt3 = pt3;
    this.pt4 =createVector(this.pt3.x-(this.pt2.x-this.pt1.x),this.pt3.y-(this.pt2.y-this.pt1.y),this.pt3.z-(this.pt2.z-this.pt1.z))
    this.n = p5.Vector.cross(p5.Vector.sub(pt2,pt3) , p5.Vector.sub(pt3,pt1)) 
  }
  
  draw(){
    
    strokeWeight(4)
      beginShape()
        vertex(this.pt1.x,this.pt1.y,this.pt1.z)
        vertex(this.pt2.x,this.pt2.y,this.pt2.z)
        vertex(this.pt3.x,this.pt3.y,this.pt3.z)
        vertex(this.pt4.x,this.pt4.y,this.pt4.z)    
      endShape(CLOSE)
  
  }

  intersection(l,lPos) {
    let h = helper.intersection(l,lPos,this.pt1,this.pt2,this.pt3)
    if(h) return h 
    else
    return helper.intersection(l,lPos,this.pt1,this.pt3,this.pt4)
  }

  toJSON(){
    return "{"+
    '"pt1":[' + this.pt1.x+','+ this.pt1.y+','+  this.pt1.z + '],' +
    '"pt2":[' + this.pt2.x+','+ this.pt2.y+','+  this.pt2.z + '],' +
    '"pt3":[' + this.pt3.x+','+ this.pt3.y+','+  this.pt3.z + ']' +
    "}"
  }

  static fromJSON(json){
    let pt1 = createVector(json.pt1[0],json.pt1[1],json.pt1[2])      
    let pt2 = createVector(json.pt2[0],json.pt2[1],json.pt2[2])    
    let pt3 = createVector(json.pt3[0],json.pt3[1],json.pt3[2])      

    return new Plate(pt1,pt2,pt3)
  }
}