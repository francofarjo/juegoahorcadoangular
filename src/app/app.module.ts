import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { HangmanComponent } from './components/hangman/hangman.component';
import { InputComponent } from './components/input/input.component';
import { StatusComponent } from './components/status/status.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HangmanComponent,
    InputComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
