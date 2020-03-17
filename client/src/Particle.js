const k = 0; //жесткость молекулы
class Particle {
    constructor(cvs, x, y, r, center) {

        this.id = `f${(~~(Math.random() * 1e8)).toString(16)}`;
        this.context = cvs.getContext('2d');
        this.x = x;
        this.y = y;
        this.color = 'white';
        this.r = r;

        this.dirty = false;

        let radius_vector = kontra.Vector(center.x - this.x, center.y - this.y)
        let speed_direction = kontra.Vector(radius_vector.y, -radius_vector.x).norm();//rotate bt 90 to get tangent
        let speed_value = .015;

        this.dx = speed_value * radius_vector.size() * speed_direction.x;
        this.dy = speed_value * radius_vector.size() * speed_direction.y;


        this.ddx = 0;
        this.ddy = 0;
        this.m = r / 50;
    }


    render() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        this.context.fill();
        this.context.closePath();
    }

}

