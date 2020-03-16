let record = [];
let animate1 = false;
class ProtoDisk {
    constructor(cvs, x, y) {
        this.canvas = cvs;
        this.context = cvs.getContext('2d');

        this.W = innerWidth;
        this.H = innerHeight;
        this.center = {x: x, y: y};
        this.r = 200;

        this.particles = [];
        this.mass_center = {x: null, y: null};

        this.init();
        this.animateBegin = false;
        this.frame = 0;
    }

    init() {

        for (let i = 0; i < 5000; i++) {
            let r = Math.random() * (this.r - this.r * 0.1) + this.r * 0.1,
                fi = 2 * Math.PI * Math.random(),
                x = r * Math.cos(fi),
                y = r * Math.sin(fi);
            this.particles.push(new Particle(this.canvas, this.center.x + x, this.center.y + y, 1, this.center));
        }
        this.update2();
    }

    updateMassCenter() {
        this.mass_center.x = this.mass_center.y = 0;
        let M = 0;
        for (let p of this.particles) {
            this.mass_center.x += p.m * p.x;
            this.mass_center.y += p.m * p.y;
            M += p.m;
        }
        this.mass_center.x /= M;
        this.mass_center.y /= M;
    }
    update(){

    }
    update2() {
        let particles = [];
        for (let p of this.particles) if (!p.dirty) particles.push(p);
        this.particles = particles;
        this.updateMassCenter();
        axios.post('/api/calc', {
            parent: {
                center: this.center,
                mass_center: this.mass_center,
            },
            particles: this.particles
        }).then((data) => {
            this.update2();
            this.particles = data.data.particles;
            record.push(data.data.particles)
        });
    }

    render() {
        if(animate1){

                    for(let p of record[this.frame]) {
                        this.context.beginPath();
                        this.context.fillStyle = 'white';
                        this.context.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                        this.context.fill();
                        this.context.closePath();
                    }
                    this.frame++;


        } else {
            this.frame = 0;

        }

    }

}
function animatePlot(){
    animate1 = !animate1;
}

