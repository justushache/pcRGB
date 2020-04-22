class Connections {
  constructor(visible) {
    if (visible == true) {
      this.show();
    }
  }

  show(lightsList) {
    let overlay = document.getElementById("overlay")
    while (overlay.firstChild) {
      overlay.removeChild(overlay.firstChild)
    }
    overlay.style.display = "block";
    
    let connectionsList  = this.createConnList(lightsList)
    this.tableCreate(connectionsList)
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
  
  createConnList(lightsList){
    let added = 0
    let connectionsList = []
    for(let i = 0 ; i < lightsList.length; i++){
      let l = lightsList[i] 
      if(!l.hasPreviousLight()){
        let arr = []
        arr.push(l)
        connectionsList.push(arr)
        added++
      }
    }
    let timeout = millis()+50
    while(added!=lightsList.length&&millis() < timeout){
      for(let i = 0 ; i < lightsList.length; i++){
        let l = lightsList[i]
        let flag = true
        if(l.hasPreviousLight())
          for(let j = 0; j < connectionsList.length&&flag; j++){
            if(l.getPreviousLight() == connectionsList[j][connectionsList[j].length-1].getID()){
              connectionsList[j].push(l)
              added++
              flag = false
          }
          }
      }
    }
    return connectionsList
  }
  tableCreate(connectionsList) {
    var body = document.getElementById('overlay');
    var tbl = document.createElement('table');
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    
    for (var i = 0; i < connectionsList.length; i++) {
      var tr = document.createElement('tr');
    
      for (var j = 0; j < connectionsList[i].length; j++) {
        if (i == 2 && j == 1) {
          break
        } else {
          var td = document.createElement('td');
          td.appendChild(document.createTextNode(connectionsList[i][j].getID()))
          i == 1 && j == 1 ? td.setAttribute('rowSpan', '2') : null;
          tr.appendChild(td)
        }
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)
  }
}