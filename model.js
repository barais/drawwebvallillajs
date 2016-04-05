

function Drawing(){
  this.forms = new Array();
  this.getForms = function() {
    return this.forms;
  }.bind(this) ;

  this.addForms = function(form) {
    this.forms.push(form);
  }.bind(this) ;


}


function MyForm(initX,initY,finalX,finalY,epaisseur,couleur) {
  this.initX = initX;
  this.initY = initY;
  this.finalX = finalX;
  this.finalY = finalY;
  this.epaisseur = epaisseur;
  this.couleur = couleur;

  this.getInitX = function() {
    return   this.initX;
  }.bind(this) ;

  this.getInitY = function() {
    return   this.initY;

  }.bind(this) ;
  this.getFinalX = function() {
    return   this.finalX;

  }.bind(this) ;
  this.getFinalY = function() {
    return   this.finalY;

  }.bind(this) ;

  this.getEpaisseur = function() {
    return   this.epaisseur;

  }.bind(this) ;

  this.getCouleur = function() {
    return   this.couleur;
  }.bind(this) ;

}

function Line(initX,initY,finalX,finalY,epaisseur,couleur){
  MyForm.call(this, initX,initY,finalX,finalY,epaisseur,couleur);
};
Line.prototype = new MyForm();

function Rectangle(initX,initY,finalX,finalY,epaisseur,couleur){
    MyForm.call(this, initX,initY,finalX,finalY,epaisseur,couleur);
};
Rectangle.prototype = new MyForm();
