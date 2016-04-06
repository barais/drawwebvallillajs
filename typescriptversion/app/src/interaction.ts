

// La création d'un Dnd requière un canvas et un interacteur.
// L'interacteur viendra dans un second temps donc ne vous en souciez pas au départ.

export interface Interactor {
  onInteractionStart(dnd: DnD);
  onInteractionUpdate(dnd: DnD);
  onInteractionEnd(dnd: DnD);
}


export class DnD {
  constructor(public boundingObject: HTMLCanvasElement, interactor: Interactor) {
    this.boundingObject.onmousedown = (evt: MouseEvent) => {
      this.pression = true;
      this.initX = getMousePosition(boundingObject, evt).x;
      this.initY = getMousePosition(boundingObject, evt).y;
      interactor.onInteractionStart(this);
    }

    this.boundingObject.onmousemove = (evt: MouseEvent) => {
      if (this.pression) {
        this.finalX = getMousePosition(boundingObject, evt).x;
        this.finalY = getMousePosition(boundingObject, evt).y;
        interactor.onInteractionUpdate(this);
      }
    }
    this.boundingObject.onmouseup = (evt: MouseEvent) => {
      this.pression = false;
      this.finalX = getMousePosition(boundingObject, evt).x;
      this.finalY = getMousePosition(boundingObject, evt).y;
      interactor.onInteractionEnd(this);
    }
  }
  private initX: number = 0;
  private initY: number = 0;
  private finalX: number = 0;
  private finalY: number = 0;
  private pression: boolean = false;

  public getInitX(): number {
    return this.initX;
  }

  public getInitY(): number {
    return this.initY;

  }
  public getFinalX(): number {
    return this.finalX;

  }
  public getFinalY(): number {
    return this.finalY;

  }


};
export function getMousePosition(can: HTMLCanvasElement, evt: MouseEvent) {
  var rect = can.getBoundingClientRect();
  
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
};
