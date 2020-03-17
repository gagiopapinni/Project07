var express = require('express');
var router = express.Router();

var {kontra} = require('../client/lib/kontraServ');
var asyncc = require('async');
const {Worker} = require('worker_threads');


router.post('/', async function (req, res) {
    let threadsCount = 2;
    let {particles, parent} = req.body;
    let particleCopy = particles.slice();
    let count = particles.length / threadsCount;
    let newParticles = [];
    let threads = {workers: [], flags: []};
    for (let i = 0; i < threadsCount; i++) {
        let worker = new Worker(__dirname + '/particleJob.js', {
            workerData: {
                particles: particles.splice(0, count),
                parent,
                allParticles: particleCopy
            }
        });
        worker.on('message', resolve => {
            threads.flags[i] = true;
            newParticles.push(...resolve.particles);
            for (let j = 0; j < threadsCount; j++) {
                if (!threads.flags[j]) {
                    return;
                }
            }
            res.status(200).json({particles: newParticles})
        });
        worker.on('error', reject => console.log(reject));
    }



});

module.exports = router;
