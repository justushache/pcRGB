class LightObject {
  constructor(ledCount,id, plane) {
    this.id = id
    this.plane = plane //the direction in which the nuber is shown
    this.ledCount = ledCount
    this.lights = []
    this.color = color(0, 0, 0) // stroke Color
    this.animation = "rainbow - vertical"
    this.lColor = "555"
    this.speed = 100
    this.LastLight = false
    this.previousLightObject = false
    this.hasPreviousLightObject = false
    this.connected = false

    for (let i = 0; i < ledCount; i++) {
      this.lights.push(false)
    }
  }


  draw() {
    console.log("should be overwritten")
  }
  
  setCursorPoint(cp) {
    console.log("should be overwritten")
  }

  setAnimation(animation) {
    this.animation = animation
  }
  
  getType(){
    console.log("should be overwritten")
  }
  
  getAnimationModes(){
    console.log("should be overwritten")
  }

  setSpeed(speed){
    this.speed = speed
  }
  
  setColor(color){
  this.lColor = color
  }
  
  getClosestLed(cp){
    console.log("should be overwritten")
  }
  
  getLightPosition(index){
    console.log("should be overwritten")
  }
  
  getLightColor(index,frame){// returns the color, which shall be displayed for the specified light, animations have to have a period at the 1000th fram
    console.log("should be overwritten")
  }
  
  setLightColor(index,color){//sets the color of one specific light, index = -1 to select all color = false for normal animation
    if(index == -1){
      for(let i = 0 ; i < this.lights.length; i++){
        this.lights[i] = color
      }
      return
    }
    this.lights[index] = color 
  }
    
  connectLight(lastLightIndex,nextLightObject){
    this.connected = true
    this.lastLight = lastLightIndex
    this.nextLightObject = nextLightObject
  }
  setPreviousLightObject(previousLightObject){
    this.previousLightObject = previousLightObject
    this.hasPreviousLightObject = true
  
  }
    
  isConnected(){
    return this.connected
  }
    
  getClosestLed(cp){//returns the closest LED
    let minD = Infinity
    let index = false
    for(let i=0; i < this.ledCount;i++){
      let d = p5.Vector.sub(getLedPosition(i),cp).mag()
      if(d<minD){
        minD = d 
        index = i
      }
    }
    return [index,minD]//return index and distance
  }
  hasPreviousLight(){
    return this.hasPreviousLightObject
  }
  getPreviousLight(){
    return this.previousLightObject    
  }
  drawText(){
    console.log("should be overwritten")
  }
  getID(){
    return this.id
  }

  toJSON(){
    return "" +  
    '"type":'                     + JSON.stringify(this.getType()               )+ ',' + 
    '"color":['     +red(this.color) +','+green(this.color)+','+blue(this.color)+'],'+
    '"animation":'              + JSON.stringify(this.animation               )+ "," +
    '"lColor":'                 + JSON.stringify(this.lColor                  )+ "," +
    '"speed":'                  + JSON.stringify(this.speed                   )+ "," +
    '"LastLight":'              + JSON.stringify(this.LastLight               )+ "," +
    '"previousLightObject":'    + JSON.stringify(this.previousLightObject     )+ "," +
    '"hasPreviousLightObject":' + JSON.stringify(this.hasPreviousLightObject  )+ "," +
    '"connected":'              + JSON.stringify(this.connected               )+ ","
  }

  fromJSON(json){
    this.color                   = color(json.color[0],json.color[1],json.color[2])
    this.animation               = json.animation             
    this.lColor                  = json.lColor                
    this.speed                   = json.speed                 
    this.LastLight               = json.LastLight             
    this.previousLightObject     = json.previousLightObject   
    this.hasPreviousLightObject  = json.hasPreviousLightObject
    this.connected               = json.connected             
  }
}