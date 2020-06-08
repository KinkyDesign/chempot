import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
// By importing the jsme.nocache.js file here I get in my chrome page a second instance of the jsme container
// If I dont source it in index.html and I only import it here errors occur
// import "../assets/JSME_2017-02-26/jsme/jsme.nocache.js";

// import {ApiService} from '../api.service';





declare var JSApplet: any;
declare var jsmeApplet: any; 


@Component({
    selector: 'my-jsme',
    templateUrl: './jsme.component.html',
    styleUrls: ['./jsme.component.css']
  })

export class jsmeComponent {



    ngOnInit() {
  
      function jsmeOnLoad() {
        jsmeApplet = new JSApplet.JSME("jsme_container", "380px", "340px");
        
      }
         

  
      const button = document.querySelector('button');
      if (button) {
  
        button.addEventListener('click', event => console.log(JSON.stringify(jsmeApplet.smiles())))

        button.addEventListener('click', event => getSmiles(JSON.stringify(jsmeApplet.smiles())))

        function getSmiles (event) {
          if (event.origin !== "http://localhost:4200")
          return event;
        }
  
  
      }
  
    }
  
  
  }
   
