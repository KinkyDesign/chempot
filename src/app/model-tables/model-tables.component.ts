import { Component, OnInit } from '@angular/core';
import { Model } from '../jaqpot-client/model/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SelectedModelsStateService } from '../model-checkboxes/selectedModels-state.service';
import { SmilesStateService } from '../jsme/smiles-state.service';
import { Chempot } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { OidcSecurityService } from 'angular-auth-oidc-client';
// import { PredictionService } from './prediction-service'
// import { Observable, BehaviorSubject } from 'rxjs'
// import { ModelApiService } from '../jaqpot-client/api/model.service';
import { JaqpotClient } from '@euclia/jaqpot-client';
import { Prediction } from '@euclia/jaqpot-client/dist/models/jaqpot.models';



@Component({
  selector: 'app-model-tables',
  templateUrl: './model-tables.component.html',
  styleUrls: ['./model-tables.component.scss'],
})
export class ModelTables implements OnInit {

  form: FormGroup;
  modelControl: FormControl;
  selectedModels: Model[] = [];
  selected_smile: string;
  displayedColumns: string[] = ['Model Title', 'Smiles', 'Prediction'];
  selected_model_ids: string[];
  chempot: Chempot = {};
  token: string;
  
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
    this.selectedModelsStateService.selectedModelsChange$.subscribe(selected_models => {
      
      
      this.selectedModels = selected_models;
      // console.log(this.selectedModels);

    });  
    
    
    this.smilesStateService.smilesChange$.subscribe(smile => {
      
      
      this.selected_smile = smile;
      console.log(this.selected_smile);

    });    

    // console.log(this.jaqpotClient.chempot(this.chempot, this.token).then((res:Prediction)=>{
    //   res.data;
    //   res.predictions;
    //   }));



    // this.predictionService.predict_selected(this.chempot);
    // console.log(this.predictionService.predict_selected(this.chempot));


    this.modelControl = new FormControl();

  }




}




