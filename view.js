
// Implémenter ici les fonctions paint à ajouter dans chacune des classes du modèle.

MyForm.prototype.clear = function(ctx) {
  canvas.getContext('2d').fillStyle = '#F0F0F0'; // set canvas' background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};


Rectangle.prototype.paint = function(ctx) {
  ctx.lineWidth = this.getEpaisseur();
  ctx.strokeStyle=this.getCouleur();
  ctx.rect(this.getInitX(),this.getInitY(),this.getFinalX(),this.getFinalY());
  ctx.stroke();
};

Line.prototype.paint = function(ctx) {
ctx.lineWidth = this.getEpaisseur();
ctx.strokeStyle=this.getCouleur();
ctx.beginPath();
  ctx.moveTo(this.getInitX(),this.getInitY());
  ctx.lineTo(this.getFinalX(),this.getFinalY());
  ctx.stroke();
};


Drawing.prototype.paint = function(ctx) {
  ctx.fillStyle = '#F0F0F0'; // set canvas' background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.getForms().forEach(function(eltDuTableau) {
      eltDuTableau.paint(ctx); });
};
