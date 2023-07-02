export class Palabra{
    palabra: string;
    type: string;
    longitud: number;

  
    constructor(palabra: string, type:string){
      this.palabra = palabra;
      this.type= type;
      this.longitud = palabra.length;
    }
  }
  