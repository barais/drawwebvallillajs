
// Implémenter ici les 4 classes du modèle.
// N'oubliez pas l'héritage !



function Drawing(){
  this.forms = new Array();
  this.getForms = function() {
    return this.forms;
  }.bind(this) ;

  this.addForms = function(form) {
    this.forms.push(form);
  }.bind(this) ;

}


function MyForm(initX,initY,finalX,finalY) {
  this.initX = initX;
  this.initY = initY;
  this.finalX = finalX;
  this.finalY = finalY;

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

}

function Line(initX,initY,finalX,finalY){
  MyForm.call(this, initX,initY,finalX,finalY);
};
Line.prototype = new MyForm();

function Rectangle(initX,initY,finalX,finalY){
    MyForm.call(this, initX,initY,finalX,finalY);
};
Rectangle.prototype = new MyForm();
