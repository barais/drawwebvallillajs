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
            //require to apply aspect
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZGVsLnRzIiwidmlldy50cyIsImludGVyYWN0aW9uLnRzIiwiY29udHJvbGxlci50cyIsIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O1lBRUE7Z0JBQUE7b0JBQ1UsVUFBSyxHQUFrQixJQUFJLEtBQUssRUFBVSxDQUFDO2dCQU9yRCxDQUFDO2dCQU5RLDBCQUFRLEdBQWY7b0JBQ0UsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ3BCLENBQUM7Z0JBQ00seUJBQU8sR0FBZCxVQUFlLElBQVk7b0JBQ3pCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QixDQUFDO2dCQUNILGNBQUM7WUFBRCxDQVJBLEFBUUMsSUFBQTtZQVJELDZCQVFDLENBQUE7WUFHRDtnQkFFRSxnQkFBbUIsS0FBYSxFQUFTLEtBQWEsRUFBUyxNQUFjLEVBQVMsTUFBYyxFQUFTLFNBQWlCLEVBQVMsT0FBZTtvQkFBbkksVUFBSyxHQUFMLEtBQUssQ0FBUTtvQkFBUyxVQUFLLEdBQUwsS0FBSyxDQUFRO29CQUFTLFdBQU0sR0FBTixNQUFNLENBQVE7b0JBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtvQkFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO29CQUFTLFlBQU8sR0FBUCxPQUFPLENBQVE7Z0JBQ3RKLENBQUM7Z0JBQ00seUJBQVEsR0FBZjtvQkFDRSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDcEIsQ0FBQztnQkFDTSx5QkFBUSxHQUFmO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNwQixDQUFDO2dCQUVNLDBCQUFTLEdBQWhCO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUNNLDBCQUFTLEdBQWhCO29CQUNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNyQixDQUFDO2dCQUdNLDZC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SSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQyxDQUFHLDJCQUEyQjtnQkFDN0QsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztnQkFDbkMsR0FBRyxDQUFDLGtCQUFrQixHQUFHLFVBQVUsSUFBSTtvQkFDcEMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2QixFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFBLENBQUM7NEJBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDOzRCQUNoRCxRQUFRLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsQ0FBRSxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2hGLENBQUM7d0JBQ0QsSUFBSSxDQUFBLENBQUM7NEJBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLCtDQUErQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDOzRCQUNyRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFBO3dCQUNqQixDQUFDO29CQUNKLENBQUM7Z0JBQ0gsQ0FBQyxDQUFDO2dCQUNGLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxjQUFjLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQztnQkFDdkUsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1lBRWIsQ0FBQyxDQUFDIiwiZmlsZSI6ImFwcC9idWlsZC9mdWxsUHJvamVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlxuXG5leHBvcnQgY2xhc3MgRHJhd2luZyB7XG4gIHByaXZhdGUgZm9ybXM6IEFycmF5PE15Rm9ybT4gPSBuZXcgQXJyYXk8TXlGb3JtPigpO1xuICBwdWJsaWMgZ2V0Rm9ybXMoKTogQXJyYXk8TXlGb3JtPiB7XG4gICAgcmV0dXJuIHRoaXMuZm9ybXM7XG4gIH1cbiAgcHVibGljIGFkZEZvcm0oZm9ybTogTXlGb3JtKSB7XG4gICAgdGhpcy5mb3Jtcy5wdXNoKGZvcm0pOyAgXG4gIH1cbn1cblxuXG5leHBvcnQgY2xhc3MgTXlGb3JtIHtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgaW5pdFg6IG51bWJlciwgcHVibGljIGluaXRZOiBudW1iZXIsIHB1YmxpYyBmaW5hbFg6IG51bWJlciwgcHVibGljIGZpbmFsWTogbnVtYmVyLCBwdWJsaWMgZXBhaXNzZXVyOiBudW1iZXIsIHB1YmxpYyBjb3VsZXVyOiBzdHJpbmcpIHtcbiAgfVxuICBwdWJsaWMgZ2V0SW5pdFgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbml0WDtcbiAgfVxuICBwdWJsaWMgZ2V0SW5pdFkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5pbml0WTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRGaW5hbFgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5maW5hbFg7XG4gIH1cbiAgcHVibGljIGdldEZpbmFsWSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmZpbmFsWTtcbiAgfVxuXG5cbiAgcHVibGljIGdldEVwYWlzc2V1cigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmVwYWlzc2V1cjtcbiAgfVxuICBwdWJsaWMgZ2V0Q291bGV1cigpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmNvdWxldXI7XG4gIH1cblxufVxuXG5leHBvcnQgY2xhc3MgTGluZSBleHRlbmRzIE15Rm9ybSB7XG59XG5leHBvcnQgY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgTXlGb3JtIHtcbn1cbiIsImltcG9ydCAqIGFzIG1vZGVsICBmcm9tIFwiLi9tb2RlbFwiO1xuXG4vLyBJbXBsw6ltZW50ZXIgaWNpIGxlcyBmb25jdGlvbnMgcGFpbnQgw6AgYWpvdXRlciBkYW5zIGNoYWN1bmUgZGVzIGNsYXNzZXMgZHUgbW9kw6hsZS5cblxuXG5cbi8vIENyZWF0ZSBhbiBhdWdtZW50YXRpb24gZm9yIFwiLi9vYnNlcnZhYmxlXCJcbmRlY2xhcmUgbW9kdWxlIFwiLi9tb2RlbFwiIHtcblxuICAgIC8vIEF1Z21lbnQgdGhlICdPYnNlcnZhYmxlJyBjbGFzcyBkZWZpbml0aW9uIHdpdGggaW50ZXJmYWNlIG1lcmdpbmdcbiAgICBpbnRlcmZhY2UgRHJhd2luZyB7XG4gICAgICAgIGRyYXcoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB9XG4gICAgaW50ZXJmYWNlIE15Rm9ybSB7XG4gICAgICAgIGRyYXcoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKTtcbiAgICB9XG4gICAgaW50ZXJmYWNlIExpbmUge1xuICAgICAgICBkcmF3KGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfVxuICAgIGludGVyZmFjZSBSZWN0YW5nbGUge1xuICAgICAgICBkcmF3KGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQsICBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCk7XG4gICAgfVxuXG59XG5cbm1vZGVsLkRyYXdpbmcucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4LmZpbGxTdHlsZSA9ICcjRjBGMEYwJzsgLy8gc2V0IGNhbnZhcycgYmFja2dyb3VuZCBjb2xvclxuICBjdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgdGhpcy5nZXRGb3JtcygpLmZvckVhY2goKGVsdER1VGFibGVhdSkgPT4ge1xuICAgIGVsdER1VGFibGVhdS5kcmF3KGNhbnZhcyxjdHgpO1xuICB9KTtcblxuXG59O1xubW9kZWwuTXlGb3JtLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHt9O1xubW9kZWwuUmVjdGFuZ2xlLnByb3RvdHlwZS5kcmF3ID0gZnVuY3Rpb24gKCBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCAgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQpIHtcbiAgY3R4LmxpbmVXaWR0aCA9IHRoaXMuZ2V0RXBhaXNzZXVyKCk7XG4gIGN0eC5zdHJva2VTdHlsZSA9IHRoaXMuZ2V0Q291bGV1cigpO1xuICBjdHgucmVjdCh0aGlzLmdldEluaXRYKCksIHRoaXMuZ2V0SW5pdFkoKSwgdGhpcy5nZXRGaW5hbFgoKSwgdGhpcy5nZXRGaW5hbFkoKSk7XG4gIGN0eC5zdHJva2UoKTtcblxuXG5cbn07XG5tb2RlbC5MaW5lLnByb3RvdHlwZS5kcmF3PWZ1bmN0aW9uICggY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSB7XG4gIGN0eC5saW5lV2lkdGggPSB0aGlzLmdldEVwYWlzc2V1cigpO1xuICBjdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmdldENvdWxldXIoKTtcbiAgY3R4LmJlZ2luUGF0aCgpO1xuICBjdHgubW92ZVRvKHRoaXMuZ2V0SW5pdFgoKSwgdGhpcy5nZXRJbml0WSgpKTtcbiAgY3R4LmxpbmVUbyh0aGlzLmdldEZpbmFsWCgpLCB0aGlzLmdldEZpbmFsWSgpKTtcbiAgY3R4LnN0cm9rZSgpO1xufTtcblxuLy9yZXF1aXJlIHRvIGdlc3Qgc29tZXRoaW5nIHRvIGxvYWQgaW4gdGhlIG1vZHVsZSBhbmQgYXBwbHkgYXNwZWN0IG9uIHRoZSBtb2RlbCBjbGFzc1xuZXhwb3J0IGZ1bmN0aW9uIGluaXQoKXt9XG4iLCJcblxuLy8gTGEgY3LDqWF0aW9uIGQndW4gRG5kIHJlcXVpw6hyZSB1biBjYW52YXMgZXQgdW4gaW50ZXJhY3RldXIuXG4vLyBMJ2ludGVyYWN0ZXVyIHZpZW5kcmEgZGFucyB1biBzZWNvbmQgdGVtcHMgZG9uYyBuZSB2b3VzIGVuIHNvdWNpZXogcGFzIGF1IGTDqXBhcnQuXG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJhY3RvciB7XG4gIG9uSW50ZXJhY3Rpb25TdGFydChkbmQ6IERuRCk7XG4gIG9uSW50ZXJhY3Rpb25VcGRhdGUoZG5kOiBEbkQpO1xuICBvbkludGVyYWN0aW9uRW5kKGRuZDogRG5EKTtcbn1cblxuXG5leHBvcnQgY2xhc3MgRG5EIHtcbiAgY29uc3RydWN0b3IocHVibGljIGJvdW5kaW5nT2JqZWN0OiBIVE1MQ2FudmFzRWxlbWVudCwgaW50ZXJhY3RvcjogSW50ZXJhY3Rvcikge1xuICAgIHRoaXMuYm91bmRpbmdPYmplY3Qub25tb3VzZWRvd24gPSAoZXZ0OiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnByZXNzaW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuaW5pdFggPSBnZXRNb3VzZVBvc2l0aW9uKGJvdW5kaW5nT2JqZWN0LCBldnQpLng7XG4gICAgICB0aGlzLmluaXRZID0gZ2V0TW91c2VQb3NpdGlvbihib3VuZGluZ09iamVjdCwgZXZ0KS55O1xuICAgICAgaW50ZXJhY3Rvci5vbkludGVyYWN0aW9uU3RhcnQodGhpcyk7XG4gICAgfVxuXG4gICAgdGhpcy5ib3VuZGluZ09iamVjdC5vbm1vdXNlbW92ZSA9IChldnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIGlmICh0aGlzLnByZXNzaW9uKSB7XG4gICAgICAgIHRoaXMuZmluYWxYID0gZ2V0TW91c2VQb3NpdGlvbihib3VuZGluZ09iamVjdCwgZXZ0KS54O1xuICAgICAgICB0aGlzLmZpbmFsWSA9IGdldE1vdXNlUG9zaXRpb24oYm91bmRpbmdPYmplY3QsIGV2dCkueTtcbiAgICAgICAgaW50ZXJhY3Rvci5vbkludGVyYWN0aW9uVXBkYXRlKHRoaXMpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmJvdW5kaW5nT2JqZWN0Lm9ubW91c2V1cCA9IChldnQ6IE1vdXNlRXZlbnQpID0+IHtcbiAgICAgIHRoaXMucHJlc3Npb24gPSBmYWxzZTtcbiAgICAgIHRoaXMuZmluYWxYID0gZ2V0TW91c2VQb3NpdGlvbihib3VuZGluZ09iamVjdCwgZXZ0KS54O1xuICAgICAgdGhpcy5maW5hbFkgPSBnZXRNb3VzZVBvc2l0aW9uKGJvdW5kaW5nT2JqZWN0LCBldnQpLnk7XG4gICAgICBpbnRlcmFjdG9yLm9uSW50ZXJhY3Rpb25FbmQodGhpcyk7XG4gICAgfVxuICB9XG4gIHByaXZhdGUgaW5pdFg6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgaW5pdFk6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgZmluYWxYOiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGZpbmFsWTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBwcmVzc2lvbjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHB1YmxpYyBnZXRJbml0WCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmluaXRYO1xuICB9XG5cbiAgcHVibGljIGdldEluaXRZKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuaW5pdFk7XG5cbiAgfVxuICBwdWJsaWMgZ2V0RmluYWxYKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuZmluYWxYO1xuXG4gIH1cbiAgcHVibGljIGdldEZpbmFsWSgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmZpbmFsWTtcblxuICB9XG5cblxufTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRNb3VzZVBvc2l0aW9uKGNhbjogSFRNTENhbnZhc0VsZW1lbnQsIGV2dDogTW91c2VFdmVudCkge1xuICB2YXIgcmVjdCA9IGNhbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgXG4gIHJldHVybiB7XG4gICAgeDogZXZ0LmNsaWVudFggLSByZWN0LmxlZnQsXG4gICAgeTogZXZ0LmNsaWVudFkgLSByZWN0LnRvcFxuICB9O1xyXG59O1xuIiwiaW1wb3J0ICogYXMgbW9kZWwgIGZyb20gXCIuL21vZGVsXCI7XG5pbXBvcnQgKiBhcyB2aWV3IGZyb20gXCIuL3ZpZXdcIjtcbmltcG9ydCAqIGFzIGludGVyYWN0aW9uIGZyb20gXCIuL2ludGVyYWN0aW9uXCI7XG5cbiAgZXhwb3J0IGNsYXNzIFBlbmNpbCBpbXBsZW1lbnRzIGludGVyYWN0aW9uLkludGVyYWN0b3J7XG4gICAgLy8gTGlleiBpY2kgbGVzIHdpZGdldHMgw6AgbGEgY2xhc3NlIHBvdXIgbW9kaWZpZXIgbGVzIGF0dHJpYnV0cyBwcsOpc2VudHMgY2ktZGVzc3VzLlxuXG4gICAgY29uc3RydWN0b3IocHVibGljIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJELCBwdWJsaWMgZHJhd2luZzogbW9kZWwuRHJhd2luZywgcHVibGljIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgIG5ldyBpbnRlcmFjdGlvbi5EbkQoY2FudmFzLCB0aGlzKTtcbiAgICB9XG4gICAgcHJpdmF0ZSBjdXJyZW50U2hhcGU6IG1vZGVsLk15Rm9ybTtcblxuICAgIC8vIEltcGzDqW1lbnRleiBpY2kgbGVzIDMgZm9uY3Rpb25zIG9uSW50ZXJhY3Rpb25TdGFydCwgb25JbnRlcmFjdGlvblVwZGF0ZSBldCBvbkludGVyYWN0aW9uRW5kXG5cbiAgICBwdWJsaWMgb25JbnRlcmFjdGlvblN0YXJ0KGRuZDogaW50ZXJhY3Rpb24uRG5EKSB7XG4gICAgICB2YXIgZXBhaXNzZXVyOiBudW1iZXIgPSArKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3Bpbm5lcldpZHRoXCIpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlO1xuICAgICAgdmFyIGNvbG9yOiBzdHJpbmcgPSAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJjb2xvdXJcIikgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWU7XG5cbiAgICAgIGlmICggKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnV0UmVjdFwiKSBhcyBIVE1MSW5wdXRFbGVtZW50KS5jaGVja2VkICkge1xuICAgICAgICB0aGlzLmN1cnJlbnRTaGFwZSA9IG5ldyBtb2RlbC5SZWN0YW5nbGUoZG5kLmdldEluaXRYKCksIGRuZC5nZXRJbml0WSgpLCBkbmQuZ2V0RmluYWxYKCksIGRuZC5nZXRGaW5hbFkoKSwgZXBhaXNzZXVyLCBjb2xvcik7XG4gICAgICB9XG4gICAgICBlbHNle1xuICAgICAgICB0aGlzLmN1cnJlbnRTaGFwZSA9IG5ldyBtb2RlbC5MaW5lKGRuZC5nZXRJbml0WCgpLCBkbmQuZ2V0SW5pdFkoKSwgZG5kLmdldEZpbmFsWCgpLCBkbmQuZ2V0RmluYWxZKCksIGVwYWlzc2V1ciwgY29sb3IpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBwdWJsaWMgb25JbnRlcmFjdGlvblVwZGF0ZShkbmQ6IGludGVyYWN0aW9uLkRuRCkge1xuICAgICAgaWYgKHRoaXMuY3VycmVudFNoYXBlICE9IG51bGwpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U2hhcGUuZmluYWxYID0gZG5kLmdldEZpbmFsWCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnRTaGFwZS5maW5hbFkgPSBkbmQuZ2V0RmluYWxZKCk7XG4gICAgICAgIHRoaXMuZHJhd2luZy5kcmF3KHRoaXMuY2FudmFzLHRoaXMuY3R4KTtcbiAgICAgICAgdGhpcy5jdXJyZW50U2hhcGUuZHJhdyh0aGlzLmNhbnZhcyx0aGlzLmN0eCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHB1YmxpYyBvbkludGVyYWN0aW9uRW5kKGRuZDogaW50ZXJhY3Rpb24uRG5EKSB7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5maW5hbFggPSBkbmQuZ2V0RmluYWxYKCk7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5maW5hbFkgPSBkbmQuZ2V0RmluYWxZKCk7XG4gICAgICB0aGlzLmN1cnJlbnRTaGFwZS5kcmF3KHRoaXMuY2FudmFzLHRoaXMuY3R4KTtcbiAgICAgIHRoaXMuZHJhd2luZy5hZGRGb3JtKHRoaXMuY3VycmVudFNoYXBlKTtcbiAgICAgIHRoaXMuZHJhd2luZy5kcmF3KHRoaXMuY2FudmFzLHRoaXMuY3R4KTtcbiAgICB9O1xuXG5cbiAgfTtcbiIsImltcG9ydCAqIGFzIG1vZGVsIGZyb20gXCIuL21vZGVsXCI7XG5pbXBvcnQgKiBhcyB2aWV3IGZyb20gXCIuL3ZpZXdcIjtcbmltcG9ydCAqIGFzIGN0cmwgZnJvbSBcIi4vY29udHJvbGxlclwiO1xuXG4vL3JlcXVpcmUgdG8gYXBwbHkgYXNwZWN0XG52aWV3LmluaXQoKTtcblxudmFyIGNhbnZhcyA9IDxIVE1MQ2FudmFzRWxlbWVudD4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ215Q2FudmFzJyk7XG52YXIgY3R4ID0gIDxDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ+ICBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuY2FudmFzLndpZHRoPTgwMDtcbmNhbnZhcy5oZWlnaHQ9NjAwO1xuXG4vLyBDb2RlIHRlbXBvcmFpcmUgcG91ciB0ZXN0ZXIgbGUgRG5EXG5jdHguZmlsbFN0eWxlID0gJyNGMEYwRjAnOyAvLyBzZXQgY2FudmFzJyBiYWNrZ3JvdW5kIGNvbG9yXG5jdHguZmlsbFJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTsgIC8vIG5vdyBmaWxsIHRoZSBjYW52YXNcblxuLy8gQ29kZSBmaW5hbCDDoCB1dGlsaXNlciBwb3VyIG1hbmlwdWxlciBQZW5jaWwuXG52YXIgZHJhd2luZyA9IG5ldyBtb2RlbC5EcmF3aW5nKCk7XG52YXIgcGVuY2lsID0gbmV3IGN0cmwuUGVuY2lsKGN0eCwgZHJhd2luZywgY2FudmFzKTtcbi8vZHJhd2luZy5wYWludCgpO1xuXG5kcmF3aW5nLmRyYXcoY2FudmFzLGN0eCk7XG5cblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhdmUnKS5vbmNsaWNrID0gKGU6TW91c2VFdmVudCk9PiB7XG4gIHZhciB4bWxodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7ICAgLy8gbmV3IEh0dHBSZXF1ZXN0IGluc3RhbmNlXG5cdHhtbGh0dHAub3BlbihcIlBPU1RcIiwgXCIvcmVzdC90aXRpXCIpO1xuXHR4bWxodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9VVRGLThcIik7XG5cdGNvbnNvbGUubG9nKCd7IFxcXCJmaWdzXFxcIiA6ICcrIEpTT04uc3RyaW5naWZ5KGRyYXdpbmcuZ2V0Rm9ybXMoKSkrJ30nKTtcblx0eG1saHR0cC5zZW5kKCd7IFxcXCJmaWdzXFxcIiA6ICcrIEpTT04uc3RyaW5naWZ5KGRyYXdpbmcuZ2V0Rm9ybXMoKSkrJ30nKTtcblxufTtcblxuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWQnKS5vbmNsaWNrID0gKGU6TW91c2VFdmVudCk9PiB7XG5cdHZhciByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTsgICAvLyBuZXcgSHR0cFJlcXVlc3QgaW5zdGFuY2Vcblx0cmVxLm9wZW4oXCJHRVRcIiwgXCIvcmVzdC90aXRpL2xvYWRcIik7XG5cdHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoYUV2dCkge1xuXHRcdCAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcblx0XHQgICAgIGlmKHJlcS5zdGF0dXMgPT0gMjAwKXtcblx0XHQgICAgICBjb25zb2xlLmxvZyhyZXEucmVzcG9uc2VUZXh0KTtcblx0XHQgICAgICBjb25zb2xlLmxvZyhKU09OLnBhcnNlKHJlcS5yZXNwb25zZVRleHQpLmZpZ3MpO1xuXHRcdCAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BhcmVudCcpLnJlbW92ZUNoaWxkKCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2F2ZScpKTtcblx0XHQgICAgIH1cblx0XHQgICAgIGVsc2V7XG5cdFx0ICAgICAgY29uc29sZS5sb2coKFwiRXJyZXVyIHBlbmRhbnQgbGUgY2hhcmdlbWVudCBkZSBsYSBwYWdlLlxcbiArIFwiICsgcmVxLnN0YXR1cyArIFwiIFwiICsgcmVxLnJlc3BvbnNlVGV4dCkpO1xuXHRcdCAgICAgIGNvbnNvbGUubG9nKHJlcSlcblx0XHQgICAgIH1cblx0XHQgIH1cblx0XHR9O1xuXHRcdHJlcS5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PVVURi04XCIpO1xuXHRcdHJlcS5zZW5kKCk7XG5cbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
