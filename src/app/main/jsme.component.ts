import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
// By importing the jsme.nocache.js file here I get in my chrome page a second instance of the jsme container
// If I dont source it in index.html and I only import it here errors occur
// import "../assets/JSME_2017-02-26/jsme/jsme.nocache.js";

// import {ApiService} from '../api.service';




// How to import external js file into component;
// Source1: https://stackoverflow.com/questions/37081943/angular-2-import-external-js-file-into-component
// Source2: https://stackoverflow.com/questions/55487643/how-to-pass-a-value-from-index-html-page-to-component-ts-file-in-angular-4
// Source3: https://stackoverflow.com/questions/56621506/sending-variable-from-index-html-to-app-component-ts/56621543
// Source4: https://stackoverflow.com/questions/56098810/angular-7-how-to-include-inline-js-script-into-component
// Source5: https://stackoverflow.com/questions/54551487/i-want-to-download-a-script-from-cdn-and-use-it
// Source6: https://www.websparrow.org/angular/how-to-add-javascript-file-in-angular-project

declare var JSApplet: any;
declare var jsmeApplet: any; 


@Component({
    selector: 'my-jsme',
    templateUrl: './jsme.component.html',
    styleUrls: ['./jsme.component.css']
  })

export class jsmeComponent {


    // Difference between ngOnInit and contructor
    // Source: https://stackoverflow.com/questions/35763730/difference-between-constructor-and-ngoninit
    ngOnInit() {
  
      function jsmeOnLoad() {
        jsmeApplet = new JSApplet.JSME("jsme_container", "380px", "340px");
        
      }
         
      // TypeError: Cannot read property 'smiles' of undefined
      // new jsmeApplet.smiles();
      // console.log(JSON.stringify(jsmeApplet.smiles()));
      // google search: cach a native element component in angular
      // google search: how to get an element from dom angular
  
      const button = document.querySelector('button');
      if (button) {
  
        button.addEventListener('click', event => console.log(JSON.stringify(jsmeApplet.smiles())))
        // Here one more addEventListener for the same button must be added
        // This addEventListener will send the JSON.stringify(jsmeApplet.smiles())) to the api
        button.addEventListener('click', event => getSmiles(JSON.stringify(jsmeApplet.smiles())))
        // getSmiles for example
        function getSmiles (event) {
          if (event.origin !== "http://localhost:4200")
          return event;
        }
  
  
      }
  
    }
  
  
  }
   