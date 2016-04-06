System.register("model", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Drawing, MyForm, Line, Rectangle;
    return {
        setters:[],
        execute: function() {
            class Drawing {
                constructor() {
                    this.forms = new Array();
                }
                getForms() {
                    return this.forms;
                }
                addForm(form) {
                    this.forms.push(form);
                }
            }
            exports_1("Drawing", Drawing);
            class MyForm {
                constructor(initX, initY, finalX, finalY, epaisseur, couleur) {
                    this.initX = initX;
                    this.initY = initY;
                    this.finalX = finalX;
                    this.finalY = finalY;
                    this.epaisseur = epaisseur;
                    this.couleur = couleur;
                }
                getInitX() {
                    return this.initX;
                }
                getInitY() {
                    return this.initY;
                }
                getFinalX() {
                    return this.finalX;
                }
                getFinalY() {
                    return this.finalY;
                }
                getEpaisseur() {
                    return this.epaisseur;
                }
                getCouleur() {
                    return this.couleur;
                }
                paint() { }
            }
            exports_1("MyForm", MyForm);
            class Line extends MyForm {
            }
            exports_1("Line", Line);
            class Rectangle extends MyForm {
            }
            exports_1("Rectangle", Rectangle);
        }
    }
});
System.register("view", ["model"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var model;
    //require to gest something to load in the module and apply aspect on the model class
    function init() { }
    exports_2("init", init);
    return {
        setters:[
            function (model_1) {
                model = model_1;
            }],
        execute: function() {
            model.Drawing.prototype.draw = function (canvas, ctx) {
                ctx.fillStyle = '#F0F0F0'; // set canvas' background color
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                this.getForms().forEach((eltDuTableau) => {
                    eltDuTableau.draw(canvas, ctx);
                });
            };
            model.MyForm.prototype.draw = function (canvas, ctx) { };
            model.Rectangle.prototype.draw = function (canvas, ctx) {
                ctx.lineWidth = this.getEpaisseur();
                ctx.strokeStyle = this.getCouleur();
                ctx.rect(this.getInitX(), this.getInitY(), this.getFinalX(), this.getFinalY());
                ctx.stroke();
            };
            model.Line.prototype.draw = function (canvas, ctx) {
                ctx.lineWidth = this.getEpaisseur();
                ctx.strokeStyle = this.getCouleur();
                ctx.beginPath();
                ctx.moveTo(this.getInitX(), this.getInitY());
                ctx.lineTo(this.getFinalX(), this.getFinalY());
                ctx.stroke();
            };
        }
    }
});
// La création d'un Dnd requière un canvas et un interacteur.
// L'interacteur viendra dans un second temps donc ne vous en souciez pas au départ.
System.register("interaction", [], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var DnD;
    function getMousePosition(can, evt) {
        var rect = can.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }
    exports_3("getMousePosition", getMousePosition);
    return {
        setters:[],
        execute: function() {
            class DnD {
                constructor(boundingObject, interactor) {
                    this.boundingObject = boundingObject;
                    this.initX = 0;
                    this.initY = 0;
                    this.finalX = 0;
                    this.finalY = 0;
                    this.pression = false;
                    this.boundingObject.onmousedown = (evt) => {
                        this.pression = true;
                        this.initX = getMousePosition(boundingObject, evt).x;
                        this.initY = getMousePosition(boundingObject, evt).y;
                        interactor.onInteractionStart(this);
                    };
                    this.boundingObject.onmousemove = (evt) => {
                        if (this.pression) {
                            this.finalX = getMousePosition(boundingObject, evt).x;
                            this.finalY = getMousePosition(boundingObject, evt).y;
                            interactor.onInteractionUpdate(this);
                        }
                    };
                    this.boundingObject.onmouseup = (evt) => {
                        this.pression = false;
                        this.finalX = getMousePosition(boundingObject, evt).x;
                        this.finalY = getMousePosition(boundingObject, evt).y;
                        interactor.onInteractionEnd(this);
                    };
                }
                getInitX() {
                    return this.initX;
                }
                getInitY() {
                    return this.initY;
                }
                getFinalX() {
                    return this.finalX;
                }
                getFinalY() {
                    return this.finalY;
                }
            }
            exports_3("DnD", DnD);
            ;
            ;
        }
    }
});
System.register("controller", ["model", "interaction"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var model, interaction;
    var Pencil;
    return {
        setters:[
            function (model_2) {
                model = model_2;
            },
            function (interaction_1) {
                interaction = interaction_1;
            }],
        execute: function() {
            class Pencil {
                // Liez ici les widgets à la classe pour modifier les attributs présents ci-dessus.
                constructor(ctx, drawing, canvas) {
                    this.ctx = ctx;
                    this.drawing = drawing;
                    this.canvas = canvas;
                    new interaction.DnD(canvas, this);
                }
                // Implémentez ici les 3 fonctions onInteractionStart, onInteractionUpdate et onInteractionEnd
                onInteractionStart(dnd) {
                    var epaisseur = +document.getElementById("spinnerWidth").value;
                    var color = document.getElementById("colour").value;
                    if (document.getElementById("butRect").checked) {
                        this.currentShape = new model.Rectangle(dnd.getInitX(), dnd.getInitY(), dnd.getFinalX(), dnd.getFinalY(), epaisseur, color);
                    }
                    else {
                        this.currentShape = new model.Line(dnd.getInitX(), dnd.getInitY(), dnd.getFinalX(), dnd.getFinalY(), epaisseur, color);
                    }
                }
                ;
                onInteractionUpdate(dnd) {
                    if (this.currentShape != null) {
                        this.currentShape.finalX = dnd.getFinalX();
                        this.currentShape.finalY = dnd.getFinalY();
                        this.drawing.draw(this.canvas, this.ctx);
                        this.currentShape.draw(this.canvas, this.ctx);
                    }
                }
                ;
                onInteractionEnd(dnd) {
                    this.currentShape.finalX = dnd.getFinalX();
                    this.currentShape.finalY = dnd.getFinalY();
                    this.currentShape.draw(this.canvas, this.ctx);
                    this.drawing.addForm(this.currentShape);
                    this.drawing.draw(this.canvas, this.ctx);
                }
                ;
            }
            exports_4("Pencil", Pencil);
            ;
        }
    }
});
System.register("main", ["model", "view", "controller"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var model, view, ctrl;
    var canvas, ctx, drawing, pencil;
    return {
        setters:[
            function (model_3) {
                model = model_3;
            },
            function (view_1) {
                view = view_1;
            },
            function (ctrl_1) {
                ctrl = ctrl_1;
            }],
        execute: function() {
            view.init();
            canvas = document.getElementById('myCanvas');
            ctx = canvas.getContext('2d');
            canvas.width = 800;
            canvas.height = 600;
            // Code temporaire pour tester le DnD
            ctx.fillStyle = '#F0F0F0'; // set canvas' background color
            ctx.fillRect(0, 0, canvas.width, canvas.height); // now fill the canvas
            // Code final à utiliser pour manipuler Pencil.
            drawing = new model.Drawing();
            pencil = new ctrl.Pencil(ctx, drawing, canvas);
            //drawing.paint();
            drawing.draw(canvas, ctx);
            document.getElementById('save').onclick = (e) => {
                var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
                xmlhttp.open("POST", "/rest/titi");
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                console.log('{ \"figs\" : ' + JSON.stringify(drawing.getForms()) + '}');
                xmlhttp.send('{ \"figs\" : ' + JSON.stringify(drawing.getForms()) + '}');
            };
            document.getElementById('load').onclick = (e) => {
                var req = new XMLHttpRequest(); // new HttpRequest instance
                req.open("GET", "/rest/titi/load");
                req.onreadystatechange = function (aEvt) {
                    if (req.readyState == 4) {
                        if (req.status == 200) {
                            console.log(req.responseText);
                            console.log(JSON.parse(req.responseText).figs);
                            document.getElementById('parent').removeChild(document.getElementById('save'));
                        }
                        else {
                            console.log(("Erreur pendant le chargement de la page.\n + " + req.status + " " + req.responseText));
                            console.log(req);
                        }
                    }
                };
                req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                //	console.log('{ \"figs\" : '+ JSON.stringify(drawing.getForms())+'}');
                req.send();
            };
        }
    }
});
//# sourceMappingURL=fullProject.js.map