import { Component } from "@angular/core";
import { Palabra } from "src/app/models/palabra";
import { DataServices } from "src/app/providers/data.services";

@Component({
  selector: "app-hangman",
  templateUrl: "./hangman.component.html",
  styleUrls: ["./hangman.component.css"],
})
export class HangmanComponent {
  arrAdivinar: string[] = [];
  imagenes = [
    "../../../assets/img/ahorcado1.svg",
    "../../../assets/img/ahorcado2.svg",
    "../../../assets/img/ahorcado3.svg",
    "../../../assets/img/ahorcado4.svg",
    "../../../assets/img/ahorcado5.svg",
    "../../../assets/img/ahorcado6.svg",
  ];
  palabraAdivinar: string = "";
  idx = 0;
  letra: string = "";
  mensaje: string = "";
  letrasAcertadas: string[] = [];
  letrasErradas: string[] = [];
  mensajeFinal: string = "";
  imageUrl: string = "";
  intentosRestantes: number = 0;
  tablero : string[] = [];

  constructor(private db: DataServices) {
    this.db
      .getConexion()
      .then(() => {
        console.log("conexion exitosa!");
        this.setPalabra(this.db.getPalabraAleatoria());
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setPalabra(palabra: string) {
    this.palabraAdivinar = palabra;
    this.arrAdivinar = palabra.split("");
    this.arrAdivinar.forEach((caracter) => {this.tablero.push("  _  ")})
    console.log(this.arrAdivinar);
  }
  elegirLetra(): void {
    console.log(
      "🚀 ~ file: input.component.ts:11 ~ InputComponent ~ letra:",
      this.letra
    );
    this.validarLetras(this.letra);
  }
  validarLetras(letra: string) {
    const pattern = new RegExp("[a-zA-Z]");
    console.log(pattern.test(letra));
    if (!pattern.test(letra)) {
      this.mensaje = "Solo puedes ingresar letras!!!..";
      return false;
    } else {
      const coincidencias = this.buscarCoincidencia(letra, this.arrAdivinar);
      console.log("🚀 ~ file: hangman.component.ts:63 ~ HangmanComponent ~ validarLetras ~ coincidencias:", coincidencias)
      this.validarCoincidencias(coincidencias);
      this.verificarVictoria();
      return true;
    }
  }
  buscarCoincidencia(letra: string, arrAdivinar: string[]) {
    console.log("🚀 ~ file: hangman.component.ts:70 ~ HangmanComponent ~ buscarCoincidencia ~ letra:", letra)
    let coincidencias = 0;
    arrAdivinar.forEach((caracter, index) => {
      if (caracter === letra) {
        console.log("🚀 ~ file: hangman.component.ts:72 ~ HangmanComponent ~ arrAdivinar.forEach ~ caracter:", caracter)
        this.tablero[index]= caracter;
        console.log("🚀 ~ file: hangman.component.ts:76 ~ HangmanComponent ~ arrAdivinar.forEach ~ this.tablero.concat(caracter):", this.tablero.concat(caracter))
        coincidencias++;
        if (
          !this.letrasAcertadas.includes(letra) &&
          !this.letrasErradas.includes(letra)
        ) {
          this.letrasAcertadas.push(letra);
          this.mostrarLetrasAcertadas();
        }
      }
      console.log("TABLERO>>", this.tablero)
    });

    if (
      coincidencias === 0 &&
      !this.letrasAcertadas.includes(letra) &&
      !this.letrasErradas.includes(letra)
    ) {
      this.letrasErradas.push(letra);
      this.mostrarLetrasErradas();
    }
    return coincidencias;
  }

  validarCoincidencias(coincidencias: number) {
    if (coincidencias > 0) {
      this.mensaje = `Hubo ${coincidencias} coincidencias!!!`;
    } else {
      this.intentosRestantes--;
      this.mensaje = `No hubo coinciencias :(`;
      this.imageUrl = `img/ahorcado${7 - this.intentosRestantes}.svg`;
      if (this.intentosRestantes == 0) {
        this.mensajeFinal = `¡Perdiste! La palabra era "${this.arrAdivinar.join(
          ""
        )}".`;
        this.imageUrl = `img/gameover.svg`;
      }
    }
  }

  reload() {
    window.location.reload();
  }

  mostrarLetrasAcertadas() {
    this.letrasAcertadas.join(" - ");
  }
  mostrarLetrasErradas() {
    this.letrasErradas.join(" - ");
  }

  verificarVictoria() {
    if (this.letrasAcertadas.length === this.palabraAdivinar.length) {
      this.mensajeFinal = `Felicidades Ganaste !!! : )`;
      this.imageUrl = `img/happyface.svg`;
    }
  }
}
