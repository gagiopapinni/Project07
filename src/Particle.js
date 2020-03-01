
class Particle {
    constructor(cvs,x,y,r,parent_disk){
       this.parent = parent_disk;

       this.context = cvs.getContext('2d');
       this.x = x;
       this.y = y;
       this.color = 'white';
       this.r = r;
 
       this.dirty = false;
     
       let radius_vector = kontra.Vector(this.parent.center.x-this.x,this.parent.center.y-this.y)
       let speed_direction = kontra.Vector(radius_vector.y,-radius_vector.x).norm();//rotate bt 90 to get tangent
       let speed_value = .015;
 
       this.dx = speed_value*radius_vector.size()*speed_direction.x;
       this.dy = speed_value*radius_vector.size()*speed_direction.y;


       this.ddx = 0;
       this.ddy = 0;
       this.m = r/50;
    }


    update(){

       let F = {x:0,y:0}; 
       for(let p of this.parent.particles){
           if(p===this || p.dirty) continue;

           let interaction_vector = kontra.Vector(p.x-this.x,p.y-this.y);
           let r = interaction_vector.size();

           F.x += 1.5 * p.m*this.m/r * interaction_vector.norm().x;
           F.y +=  1.5 * p.m*this.m/r * interaction_vector.norm().y;

           if(this.r+p.r>r){//to close, lets merge
               let destination, source;
               if(p.m>this.m){ destination = p; source = this; }
               else{ destination = this; source = p; }
               source.dirty = true;

               destination.dx =  (this.m*this.dx+p.m*p.dx)/(this.m+p.m);   
               destination.dy =  (this.m*this.dy+p.m*p.dy)/(this.m+p.m);
              // destination.ddx+=source.ddx;
            //   destination.ddy+=source.ddy;

               destination.m+=source.m;
               source.m = 0;

               destination.r = Math.pow(Math.pow(source.r,3)+Math.pow(destination.r,3),1/3)
              // destination.x = (this.x+p.x)/2
              // destination.y = (this.y+p.y)/2
           }

       }
       if(this.dirty) return;
       this.ddx = F.x/this.m ;
       this.ddy = F.y/this.m ;

       this.x+=this.dx;
       this.y+=this.dy;
       this.dx+=this.ddx;
       this.dy+=this.ddy;
      
       this.x += this.parent.center.x-this.parent.mass_center.x;
       this.y += this.parent.center.y-this.parent.mass_center.y;
  
       //if(this.x>W) this.x = 0;
       //if(this.y>H) this.y = 0;
    }

    render(){
       this.context.beginPath();
       this.context.fillStyle = this.color;
       this.context.arc(this.x,this.y,this.r,0,Math.PI*2);
       this.context.fill();
       this.context.closePath();
    }

}

