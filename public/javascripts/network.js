

var canvas = document.getElementById("canvas");
canvas.width = document.getElementById("canvas").getBoundingClientRect().width;
canvas.height = document.getElementById("canvas").getBoundingClientRect().height;

var halfx = canvas.width / 2;
var halfy = canvas.height / 2;
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

nucleoServer.scale = new Escher.Vector2(escala, escala);

nucleoServer.layer = 2;
nucleoServer.draggable = true;

group.add(nucleoServer);

var viewport = new Escher.Viewport(canvas);

var renderer = new Escher.Renderer(canvas);

renderer.createRenderLoop(group, viewport);
var img = new Image();
var wi;
var he;
img.onload = function () {
    console.log(halfx);
    nucleoServer.position.set(halfx - (this.width * escala * 0.5), halfy - (this.height * escala * 0.5));
    nucleoServer.origin = new Escher.Vector2(this.width * escala,this.height * escala);
    wi = this.width;
    he = this.height;
}
img.src = 'images/server.png';

var list = [];

function add_app(id) {

    
    var aux_app = new Escher.Image("images/nave.png");
    aux_app.scale = new Escher.Vector2(escala, escala);
    aux_app.origin  = new Escher.Vector2(wi * escala,he * escala);
    aux_app.layer = 2;
    aux_app.draggable = true;
    group.add(aux_app);

  

    var line = new Escher.NodeConnector();
    line.from = nucleoServer.position;
    line.to = aux_app.position;
    line.layer = -1;
    line.dashPattern = [];
    line.lineWidth = 1;
    line.strokeStyle = new Escher.ColorStyle("#003366");
    group.add(line);
    list.push({ id: id, obj: aux_app, line: line });

    // aux_app.onDoubleClick = () => {
    //     line.strokeStyle = new Escher.ColorStyle("#1bbd13");
    //     setInterval(function(){ 
    //         line.strokeStyle = new Escher.ColorStyle("#003366");
    //      }, 500);
    // };
}

function remove_app(id) {
    var index;
    list.find((s, i) => {
        if (s.id == id) {
            index = i;
            return true;
        }
    });
    list[index].obj.destroy();
    list[index].line.destroy();
    list.splice(index, 1);
}

const socket = io("", {
    query: {
        type: "Monitor"
    }
});

socket.on("connect", (ele) => {
    console.log(ele);
    console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
    console.log(socket.id); // undefined
});


socket.on("add_app", (id) => {
    console.log(id);
    add_app(id.id);
})

socket.on("remove_app", (id) => {
    remove_app(id.id);
})

socket.on("all_apps", (list) => {
    console.log(list);
});

