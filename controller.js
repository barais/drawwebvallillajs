
var editingMode = { rect: 0, line: 1 };

function Pencil(ctx, drawing, canvas) {
	console.log(document.getElementById("butRect"));
	this.currEditingMode = document.getElementById("butRect").getValue//editingMode.rect;
	this.currLineWidth = 5;
	this.currColour = '#000000';
	this.currentShape = 0;
	this.ctx = ctx;

	// Liez ici les widgets à la classe pour modifier les attributs présents ci-dessus.

	new DnD(canvas, this);


	this.onInteractionStart = function(dnd) {
		//console.log(this.currEditingMode);
		if (this.currEditingMode){
			this.currentShape  = new Rectangle(dnd.initX,dnd.initY,dnd.finalX,dnd.finalY);

		}else{
			this.currentShape  = new Line(dnd.initX,dnd.initY,dnd.finalX,dnd.finalY);
		}
		//this.currentShape.paint(this.ctx);


	}.bind(this) ;

	this.onInteractionUpdate = function(dnd) {
		//console.log(this.currentShape);
		if (this.currentShape != 0){
			this.currentShape.clear(this.ctx)
			this.currentShape.finalX = dnd.finalX;
			this.currentShape.finalY = dnd.finalY;
			drawing.paint(this.ctx);
			this.currentShape.paint(this.ctx);
		}
	}.bind(this) ;

	this.onInteractionEnd = function(dnd) {
		this.currentShape.finalX = dnd.finalX;
		this.currentShape.finalY = dnd.finalY;
		this.currentShape.paint(this.ctx);
		drawing.addForms(this.currentShape);
		drawing.paint(this.ctx);
	}.bind(this) ;


	// Implémentez ici les 3 fonctions onInteractionStart, onInteractionUpdate et onInteractionEnd
};
