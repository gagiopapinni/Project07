'use strict';

let {parentPort, workerData} = require('worker_threads');
var {kontra} = require('../client/lib/kontraServ');
let {parent, particles, allParticles, newParticles} = workerData;
kontra.Vector.prototype.size = function () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
}
kontra.Vector.prototype.norm = function () {
    let size = this.size();
    return {x: this.x / size, y: this.y / size};
}
kontra.Vector.intersection = function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
    // Determine the intersection point of two line segments
    // Return FALSE if the lines don't intersect
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }
    let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    // Lines are parallel
    if (denominator === 0) {
        return false
    }
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    // is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }
    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
    return {x, y}
}
kontra.Vector.linePointDistance = function (x1, y1, x2, y2, x0, y0) {
    return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) / Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
}
let k=0.00000001, gravityScale=1.5;
for(let cp of particles){
    let {x,y,dx,dy,ddx,ddy,cr,m, id} = cp;
    let F = {x: 0, y: 0};

    for(let p of allParticles){
        if (p.id === id || p.dirty) continue;
        let interaction_vector = kontra.Vector(p.x - x, p.y - y);
        let r = interaction_vector.size();
        F.x += gravityScale * p.m * m / r * interaction_vector.norm().x;
        F.y += gravityScale * p.m * m / r * interaction_vector.norm().y;
        let repulsionVector = kontra.Vector(x - p.x, y - p.y).norm();
        let a = m + p.m,
            b = kontra.Vector(x - p.x, y - p.y).size(),
            repulsionForce = k * (Math.pow(a / b, 8) - 1);
        if (repulsionForce != Infinity) {
            F.x += repulsionForce * -repulsionVector.x;
            F.y += repulsionForce * -repulsionVector.y;
        }
        if (cr + p.r > r) {//too close, lets merge  NOPE LETS OTTALKIVAT'
            let frictionVector = {}
        }
    }
    if (this.dirty) continue;
    ddx = F.x / m;
    ddy = F.y / m;

    x += dx;
    y += dy;
    dx += ddx;
    dy += ddy;

    x += parent.center.x - parent.mass_center.x;
    y += parent.center.y - parent.mass_center.y;


    [cp.x, cp.y, cp.dx, cp.dy, cp.ddx, cp.ddy] = [x,y,dx,dy,ddx,ddy]
}



parentPort.postMessage({particles: particles});
