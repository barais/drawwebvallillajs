import * as model  from "./model";

// Implémenter ici les fonctions paint à ajouter dans chacune des classes du modèle.



// Create an augmentation for "./observable"
declare module "./model" {

    // Augment the 'Observable' class definition with interface merging
    interface Drawing {
        draw(canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D);
    }
    interface MyForm {
        draw(canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D);
    }
    interface Line {
        draw(canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D);
    }
    interface Rectangle {
        draw(canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D);
    }

}

model.Drawing.prototype.draw = function(canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#F0F0F0'; // set canvas' background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  this.getForms().forEach((eltDuTableau) => {
    eltDuTableau.draw(canvas,ctx);
  });


};
model.MyForm.prototype.draw = function ( canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D) {};
model.Rectangle.prototype.draw = function ( canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D) {
  ctx.lineWidth = this.getEpaisseur();
  ctx.strokeStyle = this.getCouleur();
  ctx.rect(this.getInitX(), this.getInitY(), this.getFinalX(), this.getFinalY());
  ctx.stroke();



};
model.Line.prototype.draw=function ( canvas: HTMLCanvasElement,  ctx: CanvasRenderingContext2D) {
  ctx.lineWidth = this.getEpaisseur();
  ctx.strokeStyle = this.getCouleur();
  ctx.beginPath();
  ctx.moveTo(this.getInitX(), this.getInitY());
  ctx.lineTo(this.getFinalX(), this.getFinalY());
  ctx.stroke();
};

//require to gest something to load in the module and apply aspect on the model class
export function init(){}
