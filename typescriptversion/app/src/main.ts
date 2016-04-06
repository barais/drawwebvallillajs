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
  var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
	xmlhttp.open("POST", "/rest/titi");
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	console.log('{ \"figs\" : '+ JSON.stringify(drawing.getForms())+'}');
	xmlhttp.send('{ \"figs\" : '+ JSON.stringify(drawing.getForms())+'}');

};

document.getElementById('load').onclick = (e:MouseEvent)=> {
	var req = new XMLHttpRequest();   // new HttpRequest instance
	req.open("GET", "/rest/titi/load");
	req.onreadystatechange = function (aEvt) {
		  if (req.readyState == 4) {
		     if(req.status == 200){
		      console.log(req.responseText);
		      console.log(JSON.parse(req.responseText).figs);
		     document.getElementById('parent').removeChild( document.getElementById('save'));
		     }
		     else{
		      console.log(("Erreur pendant le chargement de la page.\n + " + req.status + " " + req.responseText));
		      console.log(req)
		     }
		  }
		};
		req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		req.send();

};
