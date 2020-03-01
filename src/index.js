$(window).on('load',main)

function main(){
     const { canvas, context } = kontra.init();

     const W = canvas.width = innerWidth,
           H = canvas.height = innerHeight;

     let proto_disk = new ProtoDisk(canvas,W/2,H/2);

     let loop = kontra.GameLoop({

         update: function(dt) {
            proto_disk.update();
         },
         render: function() {
            context.fillStyle = 'black';
            context.fillRect(0,0,W,H);
            proto_disk.render();
         }

     });

     loop.start();
}
