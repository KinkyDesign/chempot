import { Component, OnInit } from '@angular/core';
import { Model } from '../jaqpot-client/model/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SelectedModelsStateService } from '../model-checkboxes/selectedModels-state.service';
import { SmilesStateService } from '../jsme/smiles-state.service';
import { Chempot } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatTableDataSource } from '@angular/material/table';
// import { PredictionService } from './prediction-service'
// import { Observable, BehaviorSubject } from 'rxjs'
// import { ModelApiService } from '../jaqpot-client/api/model.service';
// import { JaqpotClient } from '@euclia/jaqpot-client';
// import { Prediction } from '@euclia/jaqpot-client/dist/models/jaqpot.models';

export interface TableObject {
  ModelTitle: string
  model: Model
  smiles: string
}

@Component({
  selector: 'app-model-tables',
  templateUrl: './model-tables.component.html',
  styleUrls: ['./model-tables.component.scss'],
})
export class ModelTables implements OnInit {

  form: FormGroup;
  modelControl: FormControl;
  selectedModels: Model[] = [];
  rendered_models: TableObject[];
  selected_smile: string;
  displayedColumns: string[] = ['ModelTitle', 'Smiles', 'Predict'];
  selected_model_ids: string[];
  chempot: Chempot = {};
  token: string;
  dataSourceArray = [];
  dataSource = new MatTableDataSource<TableObject>();
  render = false;

  constructor(

    // Here are the dependencies from services. We need them to have only one instance
    private selectedModelsStateService: SelectedModelsStateService,
    private smilesStateService: SmilesStateService,
    private fb: FormBuilder,
    public oidcSecurityService: OidcSecurityService,
    // public predictionService: PredictionService,

  ) {

    this.form = this.fb.group({some_array: this.fb.array([])});
    this.chempot.descriptors = "cdk";
    this.chempot.modelId = "2XyMtChRiSfZ6UmKirhi";
    this.chempot.withDoa = false;
    this.chempot.smiles = "c2ccc(c1ccccc1)cc2";
    // this.chempot.smiles = this.selected_smile;
    this.token = this.oidcSecurityService.getToken();


   }






  ngOnInit() {
    
    // where to subscribe: https://stackoverflow.com/questions/60552742/in-angular-where-to-subscribe-in-service-or-in-component-why
  




      

      
// The subscriptions must be nested for the dataSource to be updated by both the smiles and the models.
// Nesting subscriptions is an antipattern, there are flattening functions, like mergemap, that can do
// the same job in a better way, so when there is time I should refactor this part
    this.smilesStateService.smilesChange$.subscribe(smile => {  
              this.selected_smile = smile;
              console.log(this.selected_smile);


    this.selectedModelsStateService.selectedModelsChange$.subscribe(selected_models => {      
          this.selectedModels = selected_models;
    
      
      if(this.selectedModels.length>=1){

        let i: number;
        for (i = 0; i < (this.selectedModels.length); i++){
          let rm = <TableObject>{};
          rm.model = this.selectedModels[i];
          rm.smiles = this.selected_smile;
          rm.ModelTitle = rm.model.meta.titles[0];  
          this.dataSourceArray[i] = rm;

        }
  
  
        if(this.selectedModels.length<this.dataSourceArray.length){
          this.dataSourceArray.splice(-(Math.abs(this.dataSourceArray.length-this.selectedModels.length)));
        }
        // dataSource is a MatTableDataSource object. If I dont use this kind of object and I only use
        // the dataSourceArray as the mat table dataSource, then the table will not be updated by the 
        // changes of smiles and models. Also the dataSourceArray must be passed to dataSource.data 
        // INSIDE the subscribe function of the observables, otherwise the table will not update again
        this.dataSource.data = this.dataSourceArray;

        this.render = true;


  
    
      }



    console.log(this.dataSourceArray);


        
       });  

    console.log(this.dataSourceArray);

      });   

    
    this.modelControl = new FormControl();
    
  }

  




}




