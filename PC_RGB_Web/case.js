class Case {
  constructor(w, h, d,color) {
    this.w = w;
    this.h = h;
    this.d = d;
    this.color = color;
    this.plates = [];

    this.lightsList = [];
    
    this.buildCase();
    this.id = 0
  }

  buildCase() {
    this.plates.push(new Plate(createVector(-this.w / 2, -this.h / 2, 0), createVector(this.w / 2, -this.h / 2, 0), createVector(this.w / 2, this.h / 2, 0)))

    this.plates.push(new Plate(createVector(-this.w / 2, this.h / 2, 0), createVector(-this.w / 2, -this.h / 2, 0), createVector(-this.w / 2, -this.h / 2, this.d)))

    this.plates.push(new Plate(createVector(this.w / 2, this.h / 2, 0), createVector(this.w / 2, -this.h / 2, 0), createVector(this.w / 2, -this.h / 2, this.d)))

    this.plates.push(new Plate(createVector(-this.w / 2, this.h / 2, this.d), createVector(-this.w / 2, this.h / 2, 0), createVector(this.w / 2, this.h / 2, 0)))
  }

  addLightstrip(pt1, pt2, ledCount, plane) {  // adds a new lightstrip to the case and returns its index
    this.lightsList.push(new Lightstrip(pt1, pt2, ledCount,this.id, plane))
    this.id++
    return this.lightsList.length
  }
  
  addFan(pos, r, ledCount, plane) {
    this.lightsList.push(new Fan(pos, r, ledCount,this.id,plane))
    this.id++
    return this.lightsList.length
  }


  intersection(lineDirection, lineStart, camPos) {
    let minp
    let mind = 10000000000;

    // this will run through all plates in the case and will check, which plate is nearest, if any
    this.plates.forEach(function(pl) {
      let p = pl.intersection(lineDirection, lineStart)
      if (p) {// intersection point is found
        if (p5.Vector.sub(p, camPos).mag() < mind) {// the distance between camera and the point of intersection is smaller than the last match
          mind = p5.Vector.sub(p, camPos).mag()
          minp = p
        }
      }
    })

    if (mind == 10000000000)
      return false
    return minp
  }
  
  intersectionPlane(l, lPos, camPos) {
    let minp
    let mind = 10000000000;
    this.plates.forEach(function(pl) {
      let p = pl.intersection(l, lPos)
      if (p) {
        if (p5.Vector.sub(p, camPos).mag() < mind) {
          mind = p5.Vector.sub(p, camPos).mag()
          minp = pl 
        }
      }
    })

    if (mind == 10000000000)
      return false
    return minp
  }

  draw() {    
    
    fill(this.color)
    strokeWeight(4)
    stroke(0)
    this.plates.forEach(function(pl) {
      pl.draw()
    })
    
    this.lightsList.forEach(function(light){
    light.draw()
    })
  }

  setCursorPoint(cp){ // returns the index of the selected light have to find a better name
    let r = false;
    for (let i = 0 ; i < this.lightsList.length ; i++){
      if(this.lightsList[i].setCursorPoint(cp)){
        r = i+1
      }
    }
    
    return r
  }
  
  getClosestLed(cp){//returns the index of the nearest Light and the index of the neares Led of that Light 
    let lightIndex = false;
    let ledIndex = 0;
    let minD = Infinity;
    for(let i = 0 ; i < this.lightsList.length ; i++){
      let a = this.lightsList[i].getClosestLed(cp)
      if(a[0] && a[1] < minD){
        lightIndex = i+1
        ledIndex = a[0]
        minD = a[1]
      }
    }
    return [lightIndex,ledIndex]
  }
  
  deleteLight(index){
    this.lightsList.splice(index-1,1)
  }
  
  getLight(index){
    return this.lightsList[index-1]
  }
  
  setAnimation(index,animation){
    this.lightsList[index-1].setAnimation(animation);
  }
  
  setW(w) {
    this.w = w;
  }

  setH(h) {
    this.h = h;
  }

  setD(d) {
    this.d = d;
  }
  connectLights(firstLightObject,firstLight,lastLightObject,lastLight){//connects two lightObjects together, used to export data (connected Lights are physicaly connected in series)
    
    let firstLightID = this.lightsList[firstLightObject-1].getID()
    let lastLightID = this.lightsList[lastLightObject-1].getID()
    
    
    this.lightsList[lastLightObject-1].connectLight(lastLight,firstLightID)
    this.lightsList[firstLightObject-1].setPreviousLightObject(lastLightID)
  }
  setColor(lightObjectIndex, lightIndex, color){
    if(lightObjectIndex == -1){
      for(let i = 0 ; i < this.lightsList.length; i++){
         this.lightsList[i].setLightColor(lightIndex,color)
      }
      return
    }
    this.lightsList[lightObjectIndex-1].setLightColor(lightIndex,color)
  }
  toJSON(){
    var jsonString = '{'+
    '"w":'+this.w +
    ',"h":'+this.h +
    ',"d":'+this.d +
    ',"color":['+red(this.color) + ',' + green(this.color) + ',' + blue(this.color) + ']' + 
    ',"id":' + this.id +
    ',"plates":[';
    for(let i = 0; i < this.plates.length;i++){
      if(i!=0) jsonString += ','
      jsonString+=this.plates[i].toJSON()
    }
    jsonString+= '],"lightsList":['
    for(let i = 0; i < this.lightsList.length;i++){
      if(i!=0) jsonString += ','
      jsonString+=''+this.lightsList[i].toJSON()
    }
    jsonString += "]}"
    return jsonString;
  }

  static fromJSON(jsonString){
    let json  = JSON.parse(jsonString)
    let w     = json.w
    let h     = json.h
    let d     = json.d
    let col = color(json.color[0],json.color[1],json.color[2])
    let id    = json.id
    let plates = []
    json.plates.forEach(function(val){
      plates.push(Plate.fromJSON(val))
    })

    let lightsList = []
    json.lightsList.forEach(function(val){
      switch(val.type){
        case "fan":
          lightsList.push(Fan.fromJSON(val))
          break
        case "lightstrip":
          lightsList.push(Lightstrip.fromJSON(val))
          break
      }
    })

    let ca = new Case(w, h, d,col)
    ca.id = id
    ca.plates = plates
    ca.lightsList = lightsList
    return ca
    }
}