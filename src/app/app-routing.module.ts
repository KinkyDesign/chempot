import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { JsmeComponent } from './jsme/jsme.component';


const routes: Routes = [
  {path: '', component:AppComponent},
  {path:'home', component:JsmeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
