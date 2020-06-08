import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import {ApiService} from '../api.service';
import { AppComponent } from './app.component';
import { jsmeComponent } from './main/jsme.component';

// angular nested components
// source: https://www.youtube.com/watch?v=BPLjY-9k-zE


@NgModule({
  declarations: [
    AppComponent,
    jsmeComponent ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  // providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }









