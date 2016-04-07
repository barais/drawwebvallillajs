

export class Drawing {
  private forms: Array<MyForm> = new Array<MyForm>();
  public getForms(): Array<MyForm> {
    return this.forms;
  }
  public addForm(form: MyForm) {
    this.forms.push(form);  
  }
}


export class MyForm {

  constructor(public initX: number, public initY: number, public finalX: number, public finalY: number, public epaisseur: number, public couleur: string) {
  }
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


  public getEpaisseur(): number {
    return this.epaisseur;
  }
  public getCouleur(): string {
    return this.couleur;
  }

}

export class Line extends MyForm {
}
export class Rectangle extends MyForm {
}
