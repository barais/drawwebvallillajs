var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
System.register("model", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Drawing, MyForm, Line, Rectangle;
    return {
        setters:[],
        execute: function() {
            Drawing = (function () {
                function Drawing() {
                    this.forms = new Array();
                }
                Drawing.prototype.getForms = function () {
                    return this.forms;
                };
                Drawing.prototype.addForm = function (form) {
                    this.forms.push(form);
                };
                return Drawing;
            }());
            exports_1("Drawing", Drawing);
            MyForm = (function () {
                function MyForm(initX, initY, finalX, finalY, epaisseur, couleur) {
                    this.initX = initX;
                    this.initY = initY;
                    this.finalX = finalX;
                    this.finalY = finalY;
                    this.epaisseur = epaisseur;
                    this.couleur = couleur;
                }
                MyForm.prototype.getInitX = function () {
                    return this.initX;
                };
                MyForm.prototype.getInitY = function () {
                    return this.initY;
                };
                MyForm.prototype.getFinalX = function () {
                    return this.finalX;
                };
                MyForm.prototype.getFinalY = function () {
                    return this.finalY;
                };
                MyForm.prototype.getEpaisseur = function () {
                    return this.epaisseur;
                };
                MyForm.prototype.getCouleur = function () {
                    return this.couleur;
                };
                return MyForm;
            }());
            exports_1("MyForm", MyForm);
            Line = (function (_super) {
                __extends(Line, _super);
                function Line() {
                    _super.apply(this, arguments);
                }
                return Line;
            }(MyForm));
            exports_1("Line", Line);
            Rectangle = (function (_super) {
                __extends(Rectangle, _super);
                function Rectangle() {
                    _super.apply(this, arguments);
                }
                return Rectangle;
            }(MyForm));
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
                this.getForms().forEach(function (eltDuTableau) {
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
            DnD = (function () {
                function DnD(boundingObject, interactor) {
                    var _this = this;
                    this.boundingObject = boundingObject;
                    this.initX = 0;
                    this.initY = 0;
                    this.finalX = 0;
                    this.finalY = 0;
                    this.pression = false;
                    this.boundingObject.onmousedown = function (evt) {
                        _this.pression = true;
                        _this.initX = getMousePosition(boundingObject, evt).x;
                        _this.initY = getMousePosition(boundingObject, evt).y;
                        interactor.onInteractionStart(_this);
                    };
                    this.boundingObject.onmousemove = function (evt) {
                        if (_this.pression) {
                            _this.finalX = getMousePosition(boundingObject, evt).x;
                            _this.finalY = getMousePosition(boundingObject, evt).y;
                            interactor.onInteractionUpdate(_this);
                        }
                    };
                    this.boundingObject.onmouseup = function (evt) {
                        _this.pression = false;
                        _this.finalX = getMousePosition(boundingObject, evt).x;
                        _this.finalY = getMousePosition(boundingObject, evt).y;
                        interactor.onInteractionEnd(_this);
                    };
                }
                DnD.prototype.getInitX = function () {
                    return this.initX;
                };
                DnD.prototype.getInitY = function () {
                    return this.initY;
                };
                DnD.prototype.getFinalX = function () {
                    return this.finalX;
                };
                DnD.prototype.getFinalY = function () {
                    return this.finalY;
                };
                return DnD;
            }());
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
            Pencil = (function () {
                // Liez ici les widgets à la classe pour modifier les attributs présents ci-dessus.
                function Pencil(ctx, drawing, canvas) {
                    this.ctx = ctx;
                    this.drawing = drawing;
                    this.canvas = canvas;
                    new interaction.DnD(canvas, this);
                }
                // Implémentez ici les 3 fonctions onInteractionStart, onInteractionUpdate et onInteractionEnd
                Pencil.prototype.onInteractionStart = function (dnd) {
                    var epaisseur = +document.getElementById("spinnerWidth").value;
                    var color = document.getElementById("colour").value;
                    if (document.getElementById("butRect").checked) {
                        this.currentShape = new model.Rectangle(dnd.getInitX(), dnd.getInitY(), dnd.getFinalX(), dnd.getFinalY(), epaisseur, color);
                    }
                    else {
                        this.currentShape = new model.Line(dnd.getInitX(), dnd.getInitY(), dnd.getFinalX(), dnd.getFinalY(), epaisseur, color);
                    }
                };
                ;
                Pencil.prototype.onInteractionUpdate = function (dnd) {
                    if (this.currentShape != null) {
                        this.currentShape.finalX = dnd.getFinalX();
                        this.currentShape.finalY = dnd.getFinalY();
                        this.drawing.draw(this.canvas, this.ctx);
                        this.currentShape.draw(this.canvas, this.ctx);
                    }
                };
                ;
                Pencil.prototype.onInteractionEnd = function (dnd) {
                    this.currentShape.finalX = dnd.getFinalX();
                    this.currentShape.finalY = dnd.getFinalY();
                    this.currentShape.draw(this.canvas, this.ctx);
                    this.drawing.addForm(this.currentShape);
                    this.drawing.draw(this.canvas, this.ctx);
                };
                ;
                return Pencil;
            }());
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
            document.getElementById('save').onclick = function (e) {
                var xmlhttp = new XMLHttpRequest(); // new HttpRequest instance
                xmlhttp.open("POST", "/rest/titi");
                xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                console.log('{ \"figs\" : ' + JSON.stringify(drawing.getForms()) + '}');
                xmlhttp.send('{ \"figs\" : ' + JSON.stringify(drawing.getForms()) + '}');
            };
            document.getElementById('load').onclick = function (e) {
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
                req.send();
            };
        }
    }
});
//# sourceMappingURL=fullProject.js.map