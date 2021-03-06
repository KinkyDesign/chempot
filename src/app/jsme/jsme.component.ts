import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SmilesStateService } from '../jsme/smiles-state.service';


declare var JSApplet: any;
declare var jsmeApplet: any; 

@Component({
  selector: 'app-jsme',
  templateUrl: './jsme.component.html',
  styleUrls: ['./jsme.component.scss']
})
export class JsmeComponent implements OnInit {

  jsmeApplet:any
  selected_smile: string | null = '';


  constructor(

    private smilesStateService: SmilesStateService

  ) { 

    this.smilesStateService.changeSmile(this.selected_smile);
  }



  ngOnInit(): void {
    this.jsmeApplet = new JSApplet.JSME("jsme_container", "620px", "480px");

    const button = document.querySelector('button-sm');
    if (button) {

      button.addEventListener('click', event => console.log(JSON.stringify(jsmeApplet.smiles())))

      button.addEventListener('click', event => getSmiles(JSON.stringify(jsmeApplet.smiles())))

      function getSmiles (event) {
        if (event.origin !== "http://localhost:4200")
        return event;
      }
    }

  }

  showSmiles(){
    this.selected_smile = this.jsmeApplet.smiles();

    this.smilesStateService.changeSmile(this.selected_smile);
    
    console.log(this.selected_smile);
  }




}
