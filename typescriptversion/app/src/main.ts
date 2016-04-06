import * as model from "./model";
import * as view from "./view";
import * as ctrl from "./controller";

view.init();

var canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
var ctx =  <CanvasRenderingContext2D>  canvas.getContext('2d');

canvas.width=800;
canvas.height=600;

// Code temporaire pour tester le DnD
ctx.fillStyle = '#F0F0F0'; // set canvas' background color
ctx.fillRect(0, 0, canvas.width, canvas.height);  // now fill the canvas

// Code final à utiliser pour manipuler Pencil.
var drawing = new model.Drawing();
var pencil = new ctrl.Pencil(ctx, drawing, canvas);
//drawing.paint();

drawing.draw(canvas,ctx);

document.getElementById('save').onclick = (e:MouseEvent)=> {
  console.log("log");
};
