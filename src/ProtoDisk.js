
class ProtoDisk{
    constructor(cvs,x,y){
       this.canvas = cvs;
       this.context = cvs.getContext('2d');
       
       this.W = innerWidth;
       this.H = innerHeight;
       this.center = { x:x, y:y };
       this.r = 200;

       this.particles = [];
       this.mass_center = {x:null, y: null};

       this.init();
    }

    init(){

       for(let i = 0;i<500;i++){
          let x = (this.W/2-this.r)+2*this.r*Math.random(),
              y = (this.H/2-this.r)+2*this.r*Math.random();
          this.particles.push( new Particle(this.canvas,x,y,1,this));
       }

    }
    updateMassCenter(){
       this.mass_center.x = this.mass_center.y = 0;
       let M = 0;
       for(let p of this.particles){
          this.mass_center.x+=p.m*p.x;
          this.mass_center.y+=p.m*p.y;
          M+=p.m;
       }
       this.mass_center.x/=M;
       this.mass_center.y/=M;
    }

    update(){
       let particles = []; 
       for(let p of this.particles) if(!p.dirty) particles.push(p);
       this.particles = particles;
      // console.clear();console.log(this.particles.length)
       this.updateMassCenter();
       for(let p of this.particles){
          p.update();
       }
    }
    render(){
       for(let p of this.particles) p.render();
    }
  
}
