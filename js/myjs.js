$("#btnstart").bind( "click", function(event, ui) {
  //alert("Speak")

  TTS.speak({
    text: 'Hallo! Ich bin die kleine Raupe Slim und alle meine Geschwister sind schon wunderschoene Schmetterlinge geworden und koennen fliegen. Ich moechte auch so gerne mitfliegen, aber dazu muss ich noch viel mehr Aepfel essen, um wachsen zu koennen. Der Weg zu meinen Aepfeln ist so schwer, dass ich es alleine nicht schaffe. Willst du mir dabei helfen? Zeichne mir einfach mit deinem Finger den Weg vor, damit ich weis, wo ich hinlaufen muss. Aber Vorsicht! Du darfst die Raender des Weges nicht beruehren, sonst picksen mich die Stacheln der Straeucher. Probier es doch einmal aus und zeig mir den Weg zu diesem Apfel. Wenn du soweit bist klicke auf den grossen Button unten, um loszulegen.',
    locale: 'de-DE',
    rate: 1
  }, function () {
    //  alert('success');
  }, function (reason) {
    //  alert(reason);
  });
});

// Variables for referencing the canvas and 2dcanvas context
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function redraw() {
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redraw();
}

window.addEventListener('resize', resizeCanvas, false);
resizeCanvas();

// Variables to keep track of the mouse position and left-button status
var mouseX,mouseY,mouseDown=0;

// Variables to keep track of the touch position
var touchX,touchY;

// Keep track of the old/last position when drawing a line
var lastX,lastY=-1;

var hue=0;

// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawLine(ctx,x,y,size) {

  // If lastX is not set, set lastX and lastY to the current position
  if (lastX==-1) {
    lastX=x;
    lastY=y;
  }

  sat=100; lum=50; a=255; hue+=2;

  if (hue>360) {
    hue = 0;
  }

  // Select a fill style
  ctx.strokeStyle = "hsla("+hue+","+sat+"%,"+lum+"%,"+(a/255)+")";

  // Set the line "cap" style to round, so lines at different angles can join into each other
  ctx.lineCap = "round";

  // Draw a filled line
  ctx.beginPath();

  // First, move to the old (previous) position
  ctx.moveTo(lastX,lastY);

  // Now draw a line to the current touch/pointer position
  ctx.lineTo(x,y);

  // Set the line thickness and draw the line
  ctx.lineWidth = size;
  ctx.stroke();

  ctx.closePath();

  // Update the last position to reference the current position
  lastX=x;
  lastY=y;
}

// Keep track of the mouse button being pressed and draw a dot at current location
function canvas_mouseDown() {
  mouseDown=1;
  drawLine(ctx,mouseX,mouseY,12);

}

// Keep track of the mouse button being released
function canvas_mouseUp() {
  mouseDown=0;

  // Reset lastX and lastY to -1 to indicate that they are now invalid
  lastX=-1;
  lastY=-1;

  //Canvas should be cleared when stopping the touch
  /*drawLine(ctx,mouseX,mouseY,12);*/
  /*ctx.clearRect(window.innerWidth/6, 0, window.innerWidth/1.5, window.innerHeight);*/
  /*ctx.clearRect(0, 0, ctx.innerWidth, ctx.window.innerHeight);*/
  /*ctx.clearLine(0, 0, ctx.width, ctx.height);*/
  /*ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);*/
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function canvas_mouseMove(e) {
  // Update the mouse co-ordinates when moved
  getMousePos(e);

  // Draw a dot if the mouse button is currently being pressed
  if (mouseDown==1) {
    drawLine(ctx,mouseX,mouseY,14);
    //neu zum testen
    if(mouseX > bereichDarunter && mouseX < bereichDarueber){
      ctx.clearRect(window.innerWidth/6, 0, window.innerWidth/1.5, window.innerHeight);
    }
  }

}

// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
  if (!e)
  var e = event;

  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
  else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
}

// Draw something when a touch start is detected
function canvas_touchStart() {
  // Update the touch co-ordinates
  getTouchPos();

  drawLine(ctx,touchX,touchY,12);

  // Prevents an additional mousedown event being triggered
  event.preventDefault();
}

function canvas_touchEnd() {
  // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
  lastX=-1;
  lastY=-1;
  /*ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);*/
}

// Draw something and prevent the default scrolling when touch movement is detected
function canvas_touchMove(e) {
  // Update the touch co-ordinates
  getTouchPos(e);

  // During a touchmove event -> don't need to check if the touch is engaged
  drawLine(ctx,touchX,touchY,12);
  if(touchX > bereichDarunter && touchX < bereichDarueber){
    /*ctx.fillStyle = "blue";
    ctx.fill();
    var rechteck2 = ctx.fillRect(x, y, w, h);*/
    ctx.clearRect(window.innerWidth/6, 0, window.innerWidth/1.5, window.innerHeight);
  }
  // Prevent a scrolling action as a result of this touchmove triggering.
  event.preventDefault();
}

// Get the touch position relative to the top-left of the canvas
// "target.offsetTop" to get the correct values in relation to the top left of the canvas
function getTouchPos(e) {
  if (!e)
  var e = event;

  if(e.touches) {
    if (e.touches.length == 1) { // Only deal with one finger
      var touch = e.touches[0]; // Get the information for finger #1
      touchX=touch.pageX-touch.target.offsetLeft;
      touchY=touch.pageY-touch.target.offsetTop;
    }
  }
}

// React to mouse events on the canvas, and mouseup on the entire document
canvas.addEventListener('mousedown', canvas_mouseDown, false);
canvas.addEventListener('mousemove', canvas_mouseMove, false);
window.addEventListener('mouseup', canvas_mouseUp, false);

// React to touch events on the canvas
canvas.addEventListener('touchstart', canvas_touchStart, false);
canvas.addEventListener('touchend', canvas_touchEnd, false);
canvas.addEventListener('touchmove', canvas_touchMove, false);

//Collision detection: define the different coordinates
var x, y, z, k, l, m, bereichDarunter, bereichDarueber;
x = window.innerWidth/6;
y = 0;
z = window.innerWidth/1.2;
k =  window.innerWidth/2;
l = window.innerHeight/3;
m = window.innerHeight/1.8;
bereichDarunter = z - k;
bereichDarueber = z + k;

//draw one of the "Flächen" inside the "Gebiet"
ctx.beginPath();
ctx.moveTo(x, y);
ctx.lineTo(z, y);
ctx.lineTo(z, l);
ctx.lineTo(k,m);
ctx.lineTo(x, l);
ctx.closePath();
ctx.stroke();
ctx.fillStyle = "blue";
ctx.fill();

//draw other "Fläche" in "Gebiet"
ctx.beginPath();
ctx.moveTo(window.innerWidth/6, window.innerHeight);
ctx.lineTo(window.innerWidth/6, window.innerHeight/1.5);
ctx.lineTo(window.innerWidth/2, window.innerHeight/1.2);
ctx.lineTo(window.innerWidth/1.2, window.innerHeight/1.5);
ctx.lineTo(window.innerWidth/1.2, window.innerHeight);
ctx.closePath();
ctx.stroke();
ctx.fillStyle = "red";
ctx.fill();

function erzeugeGebiet(){
  /*var gebiet = ctx.fillRect(window.innerWidth/6, 0, window.innerWidth/1.5, window.innerHeight);
  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(20, 100);
  ctx.lineTo(70, 100);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = "red";
  ctx.fill();*/
}

function erzeugeFlaeche(){

}
