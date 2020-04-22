class Settings {
  constructor(visible) {
    if (visible == true) {
      this.show();
    } else {
      document.getElementById("overlay").style.display = "none"
    }
  }

  show(light) {
    this.light = light
    let overlay = document.getElementById("overlay")
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild)
    }
    overlay.style.display = "block";
    light.getAnimationModes().forEach(function(element,index) {
      
      let btn = document.createElement("INPUT");
      btn.innerHTML = element;
      btn.name = "animation"
      btn.type = "radio"
      btn.value = element
      btn.style.visibility  = "visible";
      btn.style.left  = "5%";
      btn.style.top  = 5+index*10+"%";
      btn.addEventListener("click", function() {
          light.setAnimation(element)
        });
      
      let text = document.createElement("h1")
      text.innerHTML = element
      text.style.left = "20%"
      text.style.top  = index*10+"%";;
      text.style.position = "absolute"
      
      overlay.appendChild(btn)
      overlay.appendChild(text)
    })

    overlay.appendChild(document.createElement("br"));
    
    let div = document.createElement("DIV")
    
    let color = document.createElement("INPUT")
    color.type = "color";
    color.name = "color";
    color.style.left  = "20%";
    color.style.top  = "50%";
    color.style.width = "70%";
    color.style.visibility  = "visible";
    color.onchange = function(){
      light.setColor(color.value)}
    
    div.appendChild(color)
    
    
    var range = document.createElement("INPUT")
    range.type = "range";
    range.name = "range";
    range.min = "5"
    range.max = "500"
    color.align  = "left";
    range.style.left  = "20%";
    range.style.top  = "70%";
    range.style.width = "70%";
    range.style.visibility  = "visible";
    range.onchange = function(){
      light.setSpeed(range.value)}
    
    div.appendChild(range)
    overlay.appendChild(div)

    var closeBtn = document.createElement("BUTTON");
    overlay.appendChild(closeBtn)
    closeBtn.innerHTML = "close";
    closeBtn.addEventListener("click", this.close);
    closeBtn.style.left = "80%"
    closeBtn.style.top = "80%"
    closeBtn.style.position = "absolute"
    overlay.appendChild(closeBtn)
  }


  close() {
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  }

  isOpen() {
    if (document.getElementById("overlay").style.display == "none")
      return false
    return true
  }

}