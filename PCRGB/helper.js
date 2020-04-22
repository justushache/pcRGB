class helper{

  static isParralel(v0,v1){
    return Math.abs(v0.dot(v1)/v0.mag()*v1.mag()) //< 0.001
    
  }  
  
  static intersection(l,lPos,pt1,pt2,pt3){
        
    let v1 = p5.Vector.sub(pt2,pt3) //edge 1 of the triangle
    let v2 = p5.Vector.sub(pt3,pt1) //edge 2 of the triangle
    let v3 = p5.Vector.sub(pt1,pt2) //edge 3 of the triangle
            
    let n = p5.Vector.cross(v1,v2) 
    n.normalize()  //n is the normal vector to the plane
    let d = n.x*pt2.x+n.y*pt2.y+n.z*pt2.z // the equation of a plane is a*x+b*y+c*z=d
    let h = (d-n.x*lPos.x-n.y*lPos.y-n.z*lPos.z)/(n.x*l.x+n.y*l.y+n.z*l.z)
    let p = createVector(l.x*h+lPos.x,l.y*h+lPos.y,l.z*h+lPos.z) // the point of intersection
    
//check if point is in triangle
    
    let ap = p5.Vector.sub(p,pt1)
    let va = p5.Vector.sub(v2, p5.Vector.mult(v1,p5.Vector.dot(v1,v2)/p5.Vector.dot(v1,v1)))
    let a = p5.Vector.dot(va,ap)/p5.Vector.dot(va,v2)
    
    let bp = p5.Vector.sub(p,pt3)
    let vb = p5.Vector.sub(v1, p5.Vector.mult(v3,p5.Vector.dot(v3,v1)/p5.Vector.dot(v3,v3)))
    let b = p5.Vector.dot(vb,bp)/p5.Vector.dot(vb,v1)
    
    let cp = p5.Vector.sub(p,pt2)
    let vc = p5.Vector.sub(v3, p5.Vector.mult(v2,p5.Vector.dot(v2,v3)/p5.Vector.dot(v2,v2)))
    let c = p5.Vector.dot(vc,cp)/p5.Vector.dot(vc,v3)
    
    if(0<a&&a<1&&0<b&&b<1&&0<c&&c<1)
      return(p)//it is inside the triangle see: https://www.youtube.com/watch?v=EZXz-uPyCyA&
        
    return(false)
  }
}