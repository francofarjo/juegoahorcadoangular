import { Component } from "@angular/core";
import { DataServices } from "src/app/providers/data.services";
import { Palabra } from "../models/palabra";

@Component({
  selector: "app-hangman",
  templateUrl: "./hangman.component.html",
  styleUrls: ["./hangman.component.css"],
})
export class HangmanComponent {
  optionSelection: string = "marcas";
  arrAdivinar: string[] = [];
  palabraAdivinar: string = "";
  letra: string = "";
  mensaje: string = "";
  letrasAcertadas: string[] = [];
  letrasErradas: string[] = [];
  imageUrl: string = "../../assets/img/ahorcadoo.svg";
  intentosRestantes: number = 6;
  tablero: string[] = [];
  juegoFinalizado: boolean = false;
  acertadasUnicas: string[] = [];
  erradasUnicas: string[] = [];
  filteredData: Palabra[] =[];

  constructor(private db: DataServices) {
    this.db
      .getConexion()
      .then(() => {
        console.log("conexion exitosa!");
        this.onSelected("marcas");
      })
      .catch((err) => {
        console.log(err);
      });
  }
  onSelected(value: string): void {
    this.optionSelection = value;
    this.filterData(this.optionSelection);
  }
  filterData(option: string): void {
    this.filteredData = this.db.getArrPalabras().filter((palabra) => {
      return palabra.type === option;
    });
    this.setPalabra(this.getPalabraAleatoria());

  }
  getPalabraAleatoria(): string{
    const idx = this.idxAleatorio(this.filteredData.length);
      console.log(this.filteredData[idx].palabra);
    this.tablero=[];
    return this.filteredData[idx].palabra;
  }

  idxAleatorio(max: number): number{
    return Math.floor(Math.random() * max);
  }
  setPalabra(palabra: string) {
    this.palabraAdivinar = palabra;
    this.arrAdivinar = palabra.split("");
    this.arrAdivinar.forEach(() => {
      this.tablero.push("  _  ");
    });
    console.log(this.arrAdivinar);
  }
  elegirLetra(): void {
    this.validarLetras(this.letra);
    this.letra = "";
  }
  validarLetras(letra: string) {
    const pattern = new RegExp("[a-zA-Z]");
    console.log(pattern.test(letra));
    if (!pattern.test(letra)) {
      this.mensaje = "Solo puedes ingresar letras!!!..";
      return false;
    } else {
      const coincidencias = this.buscarCoincidencia(letra, this.arrAdivinar);
      this.validarCoincidencias(coincidencias);
      this.verificarVictoria();
      return true;
    }
  }
  buscarCoincidencia(letra: string, arrAdivinar: string[]) {
    let coincidencias = 0;
    arrAdivinar.forEach((caracter, index) => {
      if (caracter === letra) {
        this.tablero[index] = caracter;
        coincidencias++;
        this.letrasAcertadas.push(letra);
        this.letrasAcertadas.forEach((element) => {
          if (!this.acertadasUnicas.includes(element)) {
            this.acertadasUnicas.push(element);
          }
        });
      }
    });

    if (coincidencias === 0) {
      this.letrasErradas.push(letra);
      this.erradasUnicas = this.letrasErradas.filter((value, index) => {
        this.letrasErradas.indexOf(value) === index;
      });
      this.letrasErradas.push(letra);
      this.letrasErradas.forEach((element) => {
        if (!this.erradasUnicas.includes(element)) {
          this.erradasUnicas.push(element);
        }
      });
    }
    return coincidencias;
  }

  validarCoincidencias(coincidencias: number) {
    if (coincidencias > 0) {
      this.mensaje = `Hubo ${coincidencias} coincidencias!!!`;
    } else {
      this.intentosRestantes--;
      this.mensaje = `No hubo coinciencias :(`;
      this.imageUrl = `../../assets/img/ahorcado${
        7 - this.intentosRestantes
      }.svg`;
      if (this.intentosRestantes == 0) {
        this.mensaje = `¡Perdiste! La palabra era "${this.arrAdivinar.join(
          ""
        )}".`;
        this.imageUrl = `../../assets/img/gameover.svg`;
        this.juegoFinalizado = true;
      }
    }
  }

  reload() {
    window.location.reload();
  }

  verificarVictoria() {
    if (this.letrasAcertadas.length === this.palabraAdivinar.length) {
      this.mensaje = `Felicitaciones Ganaste!!! : )`;
      this.imageUrl = `../../assets/img/happyface.svg`;
      this.juegoFinalizado = true;
    }
  }
}
