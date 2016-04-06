import * as model  from "./model";
import * as view from "./view";
import * as interaction from "./interaction";

  export class Pencil implements interaction.Interactor{
    // Liez ici les widgets à la classe pour modifier les attributs présents ci-dessus.

    constructor(public ctx: CanvasRenderingContext2D, public drawing: model.Drawing, public canvas: HTMLCanvasElement) {
      new interaction.DnD(canvas, this);
    }
    private currentShape: model.MyForm;




    // Implémentez ici les 3 fonctions onInteractionStart, onInteractionUpdate et onInteractionEnd

    public onInteractionStart(dnd: interaction.DnD) {
      var epaisseur: number = +(document.getElementById("spinnerWidth") as HTMLInputElement).value;
      var color: string = (document.getElementById("colour") as HTMLInputElement).value;

      if ((document.getElementById("butRect") as HTMLInputElement).checked){
        this.currentShape = new model.Rectangle(dnd.getInitX(), dnd.getInitY(), dnd.getFinalX(), dnd.getFinalY(), epaisseur, color);
      }else{
        this.currentShape = new model.Line(dnd.getInitX(), dnd.getInitY(), dnd.getFinalX(), dnd.getFinalY(), epaisseur, color);
      }
    };

    public onInteractionUpdate(dnd: interaction.DnD) {
      if (this.currentShape != null) {
        this.currentShape.finalX = dnd.getFinalX();
        this.currentShape.finalY = dnd.getFinalY();
        this.drawing.draw(this.canvas,this.ctx);
        this.currentShape.draw(this.canvas,this.ctx);
      }
    };

    public onInteractionEnd(dnd: interaction.DnD) {
      this.currentShape.finalX = dnd.getFinalX();
      this.currentShape.finalY = dnd.getFinalY();
      this.currentShape.draw(this.canvas,this.ctx);
      this.drawing.addForm(this.currentShape);
      this.drawing.draw(this.canvas,this.ctx);
    };


  };
