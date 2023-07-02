import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Palabra } from '../models/palabra';

@Injectable({
 providedIn: 'root'
})
export class DataServices {

palabras: any[] =[];

 constructor( private afs: AngularFireDatabase ) {
    this.getConexion().then( ()=>{
    console.log('conexion exitosa!');
      this.getBD();
    }).catch( (err)=>{
     console.log(err);
 });
 this.palabras = [];
 }

  getBD(){
    console.log(this.palabras);
    return this.palabras;
  }

  getConexion(){
      return new Promise( (resolve, reject)=>{
        this.afs.object('palabras/').snapshotChanges().subscribe( (datos: any) => {
        console.log(datos);
        if(datos.payload.exists()){
          resolve(this.palabras = datos.payload.val());
        }else{
          reject(new Error('Ocurrió un problema en BD'));
        }
      });
     });
  }

  updateBD(){
    return this.afs.object('palabras/').set(this.palabras);
  }

  getArrPalabras(): Palabra[]{
    return this.palabras;
  }



}