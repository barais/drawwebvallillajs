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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVsLnRzIiwidmlldy50cyIsImludGVyYWN0aW9uLnRzIiwiY29udHJvbGxlci50cyIsIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O1lBRUE7Z0JBQUE7b0JBQ1UsVUFBSyxHQUFrQixJQUFJLEtBQUssRUFBVSxDQUFDO2dCQU9yRCxDQUFDO2dCQU5RLDBCQUFRLEdBQWY7b0JBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQ00seUJBQU8sR0FBZCxVQUFlLElBQVk7b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QixDQUFDO2dCQUNILGNBQUM7WUFBRCxDQVJBLEFBUUMsSUFBQTtZQVJELDZCQVFDLENBQUE7WUFHRDtnQkFFRSxnQkFBbUIsS0FBYSxFQUFTLEtBQWEsRUFBUyxNQUFjLEVBQVMsTUFBYyxFQUFTLFNBQWlCLEVBQVMsT0FBZTtvQkFBbkksVUFBSyxHQUFMLEtBQUssQ0FBUTtvQkFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO29CQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7b0JBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtvQkFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO29CQUFTLFlBQU8sR0FBUCxPQUFPLENBQVE7Z0JBQ3RKLENBQUM7Z0JBQ00seUJBQVEsR0FBZjtvQkFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDcEIsQ0FBQztnQkFDTSx5QkFBUSxHQUFmO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNwQixDQUFDO2dCQUVNLDBCQUFTLEdBQWhCO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUNNLDBCQUFTLEdBQWhCO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUdNLDZC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QUFJLGNBQWMsRUFBRSxDQUFDLENBQUcsMkJBQTJCO2dCQUM3RCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2dCQUNuQyxHQUFHLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxJQUFJO29CQUNwQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ3ZCLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUEsQ0FBQzs0QkFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7NEJBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQ2hELFFBQVEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxDQUFFLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDaEYsQ0FBQzt3QkFDRCxJQUFJLENBQUEsQ0FBQzs0QkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsK0NBQStDLEdBQUcsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7NEJBQ3JHLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUE7d0JBQ2pCLENBQUM7b0JBQ0osQ0FBQztnQkFDSCxDQUFDLENBQUM7Z0JBQ0YsR0FBRyxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO2dCQUN2RSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFFYixDQUFDLENBQUMiLCJmaWxlIjoiYXBwL2J1aWxkL2Z1bGxQcm9qZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5cbmV4cG9ydCBjbGFzcyBEcmF3aW5nIHtcbiAgcHJpdmF0ZSBmb3JtczogQXJyYXk8TXlGb3JtPiA9IG5ldyBBcnJheTxNeUZvcm0+KCk7XG4gIHB1YmxpYyBnZXRGb3JtcygpOiBBcnJheTxNeUZvcm0+IHtcbiAgICByZXR1cm4gdGhpcy5mb3JtcztcbiAgfSBcbiAgcHVibGljIGFkZEZvcm0oZm9ybTogTXlGb3JtKSB7XG4gICAgdGhpcy5mb3Jtcy5wdXNoKGZvcm0pO1xuICB9XG59XG5cblxuZXhwb3J0IGNsYXNzIE15Rm9ybSB7XG5cbiAgY29uc3RydWN0b3IocHVibGljIGluaXRYOiBudW1iZXIsIHB1YmxpYyBpbml0WTogbnVtYmVyLCBwdWJsaWMgZmluYWxYOiBudW1iZXIsIHB1YmxpYyBmaW5hbFk6IG51bWJlciwgcHVibGljIGVwYWlzc2V1cjogbnVtYmVyLCBwdWJsaWMgY291bGV1cjogc3RyaW5nKSB7XG4gIH1cbiAgcHVibGljIGdldEluaXRYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaW5pdFg7XG4gIH1cbiAgcHVibGljIGdldEluaXRZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaW5pdFk7XG4gIH1cblxuICBwdWJsaWMgZ2V0RmluYWxYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZmluYWxYO1xuICB9XG4gIHB1YmxpYyBnZXRGaW5hbFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5maW5hbFk7XG4gIH1cblxuXG4gIHB1YmxpYyBnZXRFcGFpc3NldXIoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5lcGFpc3NldXI7XG4gIH1cbiAgcHVibGljIGdldENvdWxldXIoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5jb3VsZXVyO1xuICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIExpbmUgZXh0ZW5kcyBNeUZvcm0ge1xufVxuZXhwb3J0IGNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIE15Rm9ybSB7XG59XG4iLCJpbXBvcnQgKiBhcyBtb2RlbCAgZnJvbSBcIi4vbW9kZWxcIjtcblxuLy8gSW1wbMOpbWVudGVyIGljaSBsZXMgZm9uY3Rpb25zIHBhaW50IMOgIGFqb3V0ZXIgZGFucyBjaGFjdW5lIGRlcyBjbGFzc2VzIGR1IG1vZMOobGUuXG5cblxuXG4vLyBDcmVhdGUgYW4gYXVnbWVudGF0aW9uIGZvciBcIi4vb2JzZXJ2YWJsZVwiXG5kZWNsYXJlIG1vZHVsZSBcIi4vbW9kZWxcIiB7XG5cbiAgICAvLyBBdWdtZW50IHRoZSAnT2JzZXJ2YWJsZScgY2xhc3MgZGVmaW5pdGlvbiB3aXRoIGludGVyZmFjZSBtZXJnaW5nXG4gICAgaW50ZXJmYWNlIERyYXdpbmcge1xuICAgICAgICBkcmF3KGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfVxuICAgIGludGVyZmFjZSBNeUZvcm0ge1xuICAgICAgICBkcmF3KGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfVxuICAgIGludGVyZmFjZSBMaW5lIHtcbiAgICAgICAgZHJhdyhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIH1cbiAgICBpbnRlcmZhY2UgUmVjdGFuZ2xlIHtcbiAgICAgICAgZHJhdyhjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpO1xuICAgIH1cblxufVxuXG5tb2RlbC5EcmF3aW5nLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24oY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eC5maWxsU3R5bGUgPSAnI0YwRjBGMCc7IC8vIHNldCBjYW52YXMnIGJhY2tncm91bmQgY29sb3JcbiAgY3R4LmZpbGxSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gIHRoaXMuZ2V0Rm9ybXMoKS5mb3JFYWNoKChlbHREdVRhYmxlYXUpID0+IHtcbiAgICBlbHREdVRhYmxlYXUuZHJhdyhjYW52YXMsY3R4KTtcbiAgfSk7XG5cblxufTtcbm1vZGVsLk15Rm9ybS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICggY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7fTtcbm1vZGVsLlJlY3RhbmdsZS5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICggY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldEVwYWlzc2V1cigpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldENvdWxldXIoKTtcbiAgY3R4LnJlY3QodGhpcy5nZXRJbml0WCgpLCB0aGlzLmdldEluaXRZKCksIHRoaXMuZ2V0RmluYWxYKCksIHRoaXMuZ2V0RmluYWxZKCkpO1xuICBjdHguc3Ryb2tlKCk7XG5cblxuXG59O1xubW9kZWwuTGluZS5wcm90b3R5cGUuZHJhdz1mdW5jdGlvbiAoIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkge1xuICBjdHgubGluZVdpZHRoID0gdGhpcy5nZXRFcGFpc3NldXIoKTtcbiAgY3R4LnN0cm9rZVN0eWxlID0gdGhpcy5nZXRDb3VsZXVyKCk7XG4gIGN0eC5iZWdpblBhdGgoKTtcbiAgY3R4Lm1vdmVUbyh0aGlzLmdldEluaXRYKCksIHRoaXMuZ2V0SW5pdFkoKSk7XG4gIGN0eC5saW5lVG8odGhpcy5nZXRGaW5hbFgoKSwgdGhpcy5nZXRGaW5hbFkoKSk7XG4gIGN0eC5zdHJva2UoKTtcbn07XG5cbi8vcmVxdWlyZSB0byBnZXN0IHNvbWV0aGluZyB0byBsb2FkIGluIHRoZSBtb2R1bGUgYW5kIGFwcGx5IGFzcGVjdCBvbiB0aGUgbW9kZWwgY2xhc3NcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCl7fVxuIiwiXG5cbi8vIExhIGNyw6lhdGlvbiBkJ3VuIERuZCByZXF1acOocmUgdW4gY2FudmFzIGV0IHVuIGludGVyYWN0ZXVyLlxuLy8gTCdpbnRlcmFjdGV1ciB2aWVuZHJhIGRhbnMgdW4gc2Vjb25kIHRlbXBzIGRvbmMgbmUgdm91cyBlbiBzb3VjaWV6IHBhcyBhdSBkw6lwYXJ0LlxuXG5leHBvcnQgaW50ZXJmYWNlIEludGVyYWN0b3Ige1xuICBvbkludGVyYWN0aW9uU3RhcnQoZG5kOiBEbkQpO1xuICBvbkludGVyYWN0aW9uVXBkYXRlKGRuZDogRG5EKTtcbiAgb25JbnRlcmFjdGlvbkVuZChkbmQ6IERuRCk7XG59XG5cblxuZXhwb3J0IGNsYXNzIERuRCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBib3VuZGluZ09iamVjdDogSFRNTENhbnZhc0VsZW1lbnQsIGludGVyYWN0b3I6IEludGVyYWN0b3IpIHtcbiAgICB0aGlzLmJvdW5kaW5nT2JqZWN0Lm9ubW91c2Vkb3duID0gKGV2dDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgdGhpcy5wcmVzc2lvbiA9IHRydWU7XG4gICAgICB0aGlzLmluaXRYID0gZ2V0TW91c2VQb3NpdGlvbihib3VuZGluZ09iamVjdCwgZXZ0KS54O1xuICAgICAgdGhpcy5pbml0WSA9IGdldE1vdXNlUG9zaXRpb24oYm91bmRpbmdPYmplY3QsIGV2dCkueTtcbiAgICAgIGludGVyYWN0b3Iub25JbnRlcmFjdGlvblN0YXJ0KHRoaXMpO1xuICAgIH1cblxuICAgIHRoaXMuYm91bmRpbmdPYmplY3Qub25tb3VzZW1vdmUgPSAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBpZiAodGhpcy5wcmVzc2lvbikge1xuICAgICAgICB0aGlzLmZpbmFsWCA9IGdldE1vdXNlUG9zaXRpb24oYm91bmRpbmdPYmplY3QsIGV2dCkueDtcbiAgICAgICAgdGhpcy5maW5hbFkgPSBnZXRNb3VzZVBvc2l0aW9uKGJvdW5kaW5nT2JqZWN0LCBldnQpLnk7XG4gICAgICAgIGludGVyYWN0b3Iub25JbnRlcmFjdGlvblVwZGF0ZSh0aGlzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5ib3VuZGluZ09iamVjdC5vbm1vdXNldXAgPSAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnByZXNzaW9uID0gZmFsc2U7XG4gICAgICB0aGlzLmZpbmFsWCA9IGdldE1vdXNlUG9zaXRpb24oYm91bmRpbmdPYmplY3QsIGV2dCkueDtcbiAgICAgIHRoaXMuZmluYWxZID0gZ2V0TW91c2VQb3NpdGlvbihib3VuZGluZ09iamVjdCwgZXZ0KS55O1xuICAgICAgaW50ZXJhY3Rvci5vbkludGVyYWN0aW9uRW5kKHRoaXMpO1xuICAgIH1cbiAgfVxuICBwcml2YXRlIGluaXRYOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGluaXRZOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGZpbmFsWDogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBmaW5hbFk6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgcHJlc3Npb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwdWJsaWMgZ2V0SW5pdFgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbml0WDtcbiAgfVxuXG4gIHB1YmxpYyBnZXRJbml0WSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmluaXRZO1xuXG4gIH1cbiAgcHVibGljIGdldEZpbmFsWCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmZpbmFsWDtcblxuICB9XG4gIHB1YmxpYyBnZXRGaW5hbFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5maW5hbFk7XG5cbiAgfVxuXG5cbn07XG5leHBvcnQgZnVuY3Rpb24gZ2V0TW91c2VQb3NpdGlvbihjYW46IEhUTUxDYW52YXNFbGVtZW50LCBldnQ6IE1vdXNlRXZlbnQpIHtcbiAgdmFyIHJlY3QgPSBjYW4uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIFxuICByZXR1cm4ge1xuICAgIHg6IGV2dC5jbGllbnRYIC0gcmVjdC5sZWZ0LFxuICAgIHk6IGV2dC5jbGllbnRZIC0gcmVjdC50b3BcbiAgfTtcclxufTtcbiIsImltcG9ydCAqIGFzIG1vZGVsICBmcm9tIFwiLi9tb2RlbFwiO1xuaW1wb3J0ICogYXMgdmlldyBmcm9tIFwiLi92aWV3XCI7XG5pbXBvcnQgKiBhcyBpbnRlcmFjdGlvbiBmcm9tIFwiLi9pbnRlcmFjdGlvblwiO1xuXG4gIGV4cG9ydCBjbGFzcyBQZW5jaWwgaW1wbGVtZW50cyBpbnRlcmFjdGlvbi5JbnRlcmFjdG9ye1xuICAgIC8vIExpZXogaWNpIGxlcyB3aWRnZXRzIMOgIGxhIGNsYXNzZSBwb3VyIG1vZGlmaWVyIGxlcyBhdHRyaWJ1dHMgcHLDqXNlbnRzIGNpLWRlc3N1cy5cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCwgcHVibGljIGRyYXdpbmc6IG1vZGVsLkRyYXdpbmcsIHB1YmxpYyBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50KSB7XG4gICAgICBuZXcgaW50ZXJhY3Rpb24uRG5EKGNhbnZhcywgdGhpcyk7XG4gICAgfVxuICAgIHByaXZhdGUgY3VycmVudFNoYXBlOiBtb2RlbC5NeUZvcm07XG5cbiAgICAvLyBJbXBsw6ltZW50ZXogaWNpIGxlcyAzIGZvbmN0aW9ucyBvbkludGVyYWN0aW9uU3RhcnQsIG9uSW50ZXJhY3Rpb25VcGRhdGUgZXQgb25JbnRlcmFjdGlvbkVuZFxuIFxuICAgIHB1YmxpYyBvbkludGVyYWN0aW9uU3RhcnQoZG5kOiBpbnRlcmFjdGlvbi5EbkQpIHtcbiAgICAgIHZhciBlcGFpc3NldXI6IG51bWJlciA9ICsoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzcGlubmVyV2lkdGhcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XG4gICAgICB2YXIgY29sb3I6IHN0cmluZyA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImNvbG91clwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcblxuICAgICAgaWYgKChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1dFJlY3RcIikgYXMgSFRNTElucHV0RWxlbWVudCkuY2hlY2tlZCl7XG4gICAgICAgIHRoaXMuY3VycmVudFNoYXBlID0gbmV3IG1vZGVsLlJlY3RhbmdsZShkbmQuZ2V0SW5pdFgoKSwgZG5kLmdldEluaXRZKCksIGRuZC5nZXRGaW5hbFgoKSwgZG5kLmdldEZpbmFsWSgpLCBlcGFpc3NldXIsIGNvbG9yKTtcbiAgICAgIH1lbHNle1xuICAgICAgICB0aGlzLmN1cnJlbnRTaGFwZSA9IG5ldyBtb2RlbC5MaW5lKGRuZC5nZXRJbml0WCgpLCBkbmQuZ2V0SW5pdFkoKSwgZG5kLmdldEZpbmFsWCgpLCBkbmQuZ2V0RmluYWxZKCksIGVwYWlzc2V1ciwgY29sb3IpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgb25JbnRlcmFjdGlvblVwZGF0ZShkbmQ6IGludGVyYWN0aW9uLkRuRCkge1xuICAgICAgaWYgKHRoaXMuY3VycmVudFNoYXBlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U2hhcGUuZmluYWxYID0gZG5kLmdldEZpbmFsWCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTaGFwZS5maW5hbFkgPSBkbmQuZ2V0RmluYWxZKCk7XG4gICAgICAgIHRoaXMuZHJhd2luZy5kcmF3KHRoaXMuY2FudmFzLHRoaXMuY3R4KTtcbiAgICAgICAgdGhpcy5jdXJyZW50U2hhcGUuZHJhdyh0aGlzLmNhbnZhcyx0aGlzLmN0eCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBvbkludGVyYWN0aW9uRW5kKGRuZDogaW50ZXJhY3Rpb24uRG5EKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5maW5hbFggPSBkbmQuZ2V0RmluYWxYKCk7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5maW5hbFkgPSBkbmQuZ2V0RmluYWxZKCk7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5kcmF3KHRoaXMuY2FudmFzLHRoaXMuY3R4KTtcbiAgICAgIHRoaXMuZHJhd2luZy5hZGRGb3JtKHRoaXMuY3VycmVudFNoYXBlKTtcbiAgICAgIHRoaXMuZHJhd2luZy5kcmF3KHRoaXMuY2FudmFzLHRoaXMuY3R4KTtcbiAgICB9O1xuXG5cbiAgfTtcbiIsImltcG9ydCAqIGFzIG1vZGVsIGZyb20gXCIuL21vZGVsXCI7XG5pbXBvcnQgKiBhcyB2aWV3IGZyb20gXCIuL3ZpZXdcIjtcbmltcG9ydCAqIGFzIGN0cmwgZnJvbSBcIi4vY29udHJvbGxlclwiO1xuXG52aWV3LmluaXQoKTtcblxudmFyIGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215Q2FudmFzJyk7XG52YXIgY3R4ID0gIDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+ICBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuY2FudmFzLndpZHRoPTgwMDtcbmNhbnZhcy5oZWlnaHQ9NjAwO1xuXG4vLyBDb2RlIHRlbXBvcmFpcmUgcG91ciB0ZXN0ZXIgbGUgRG5EXG5jdHguZmlsbFN0eWxlID0gJyNGMEYwRjAnOyAvLyBzZXQgY2FudmFzJyBiYWNrZ3JvdW5kIGNvbG9yXG5jdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTsgIC8vIG5vdyBmaWxsIHRoZSBjYW52YXNcblxuLy8gQ29kZSBmaW5hbCDDoCB1dGlsaXNlciBwb3VyIG1hbmlwdWxlciBQZW5jaWwuXG52YXIgZHJhd2luZyA9IG5ldyBtb2RlbC5EcmF3aW5nKCk7XG52YXIgcGVuY2lsID0gbmV3IGN0cmwuUGVuY2lsKGN0eCwgZHJhd2luZywgY2FudmFzKTtcbi8vZHJhd2luZy5wYWludCgpO1xuXG5kcmF3aW5nLmRyYXcoY2FudmFzLGN0eCk7XG5cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUnKS5vbmNsaWNrID0gKGU6TW91c2VFdmVudCk9PiB7XG4gIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7ICAgLy8gbmV3IEh0dHBSZXF1ZXN0IGluc3RhbmNlXG5cdHhtbGh0dHAub3BlbihcIlBPU1RcIiwgXCIvcmVzdC90aXRpXCIpO1xuXHR4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XG5cdGNvbnNvbGUubG9nKCd7IFxcXCJmaWdzXFxcIiA6ICcrIEpTT04uc3RyaW5naWZ5KGRyYXdpbmcuZ2V0Rm9ybXMoKSkrJ30nKTtcblx0eG1saHR0cC5zZW5kKCd7IFxcXCJmaWdzXFxcIiA6ICcrIEpTT04uc3RyaW5naWZ5KGRyYXdpbmcuZ2V0Rm9ybXMoKSkrJ30nKTtcblxufTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWQnKS5vbmNsaWNrID0gKGU6TW91c2VFdmVudCk9PiB7XG5cdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTsgICAvLyBuZXcgSHR0cFJlcXVlc3QgaW5zdGFuY2Vcblx0cmVxLm9wZW4oXCJHRVRcIiwgXCIvcmVzdC90aXRpL2xvYWRcIik7XG5cdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoYUV2dCkge1xuXHRcdCAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcblx0XHQgICAgIGlmKHJlcS5zdGF0dXMgPT0gMjAwKXtcblx0XHQgICAgICBjb25zb2xlLmxvZyhyZXEucmVzcG9uc2VUZXh0KTtcblx0XHQgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpLmZpZ3MpO1xuXHRcdCAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhcmVudCcpLnJlbW92ZUNoaWxkKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZScpKTtcblx0XHQgICAgIH1cblx0XHQgICAgIGVsc2V7XG5cdFx0ICAgICAgY29uc29sZS5sb2coKFwiRXJyZXVyIHBlbmRhbnQgbGUgY2hhcmdlbWVudCBkZSBsYSBwYWdlLlxcbiArIFwiICsgcmVxLnN0YXR1cyArIFwiIFwiICsgcmVxLnJlc3BvbnNlVGV4dCkpO1xuXHRcdCAgICAgIGNvbnNvbGUubG9nKHJlcSlcblx0XHQgICAgIH1cblx0XHQgIH1cblx0XHR9O1xuXHRcdHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuXHRcdHJlcS5zZW5kKCk7XG5cbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
