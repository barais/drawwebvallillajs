
// Implémenter ici les fonctions paint à ajouter dans chacune des classes du modèle.

MyForm.prototype.clear = function(ctx) {
//  ctx.save();
//  ctx.setTransform(1, 0, 0, 1, 0, 0);
//  ctx.clearRect(this.getInitX(),this.getInitY(),this.getFinalX(),this.getFinalY());
  console.log(canvas.getContext('2d'));
  canvas.getContext('2d').fillStyle = '#F0F0F0'; // set canvas' background color
console.log( canvas.width);
  ctx.fillRect(0, 0, canvas.width, canvas.height);

//  console.log('clear rect');
//  ctx.restore();
};


Rectangle.prototype.paint = function(ctx) {
  ctx.rect(this.getInitX(),this.getInitY(),this.getFinalX(),this.getFinalY());
  ctx.stroke();
  //console.log('paint rect');
};

Line.prototype.paint = function(ctx) {
//  console.log("paint line " + this.getInitX());
//ctx.fillStyle = '#F0F0F0'; // set canvas' background color
//ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(this.getInitX(),this.getInitY());
  ctx.lineTo(this.getFinalX(),this.getFinalY());
  ctx.stroke();
//  console.log('paint line');

};


Drawing.prototype.paint = function(ctx) {
  // I have lots of transforms right now
//ctx.save();
//ctx.setTransform(1, 0, 0, 1, 0, 0);
// Will always clear the right space
//ctx.clearRect(0, 0, canvas.width, canvas.height);
//ctx.restore();
//console.log("test");

// Still have my old transforms
  ctx.fillStyle = '#F0F0F0'; // set canvas' background color
  ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.getForms().forEach(function(eltDuTableau) {
    // now fill the canvas
      eltDuTableau.paint(ctx); });
};
