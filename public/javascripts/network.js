

var canvas = document.getElementById("canvas");
canvas.width = document.getElementById("canvas").getBoundingClientRect().width;
canvas.height = document.getElementById("canvas").getBoundingClientRect().height;

var halfx = canvas.width/2;
var halfy = canvas.height/2;
var escala = 0.25;

function preventDefault(event) {
    event.preventDefault();
    return false;
}

document.oncontextmenu = function (e) {
    e.preventDefault();
    return false;
}

var eventd = new Escher.EventManager();
eventd.add(canvas, 'DOMMouseScroll', preventDefault);
eventd.add(canvas, 'wheel', preventDefault);
eventd.add(canvas, 'mousewheel', preventDefault);
eventd.add(canvas, 'contextmenu', preventDefault);

eventd.create();
document.body.onresize = function () {
    canvas.width = document.getElementById("canvas").getBoundingClientRect().width;
    canvas.height = document.getElementById("canvas").getBoundingClientRect().height;
};


var group = new Escher.Object2D();

var nucleoServer = new Escher.Image("images/server.png");

nucleoServer.scale = new Escher.Vector2(escala,escala);

nucleoServer.layer = 2;
nucleoServer.draggable = true;

group.add(nucleoServer);

var viewport = new Escher.Viewport(canvas);

var renderer = new Escher.Renderer(canvas);

renderer.createRenderLoop(group, viewport);
var img = new Image();
img.onload = function() {
    console.log(halfx);
    nucleoServer.position.set(halfx - (this.width* escala*0.5), halfy - (this.height * escala * 0.5));
}
img.src = 'images/server.png';

