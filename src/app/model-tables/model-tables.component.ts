import { Component, OnInit } from '@angular/core';
import { Model } from '../jaqpot-client/model/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SelectedModelsStateService } from '../model-checkboxes/selectedModels-state.service';
import { SmilesStateService } from '../jsme/smiles-state.service';
// import { Observable, BehaviorSubject } from 'rxjs'
// import { ModelApiService } from '../jaqpot-client/api/model.service';



@Component({
  selector: 'app-model-tables',
  templateUrl: './model-tables.component.html',
  styleUrls: ['./model-tables.component.scss'],
  // providers: [SelectedModelsStateService]
  // 
})
export class ModelTables implements OnInit {

  form: FormGroup;
  modelControl: FormControl;
  selectedModels: Model[] = [];
  selected_smile: string;
  displayedColumns: string[] = ['Model Title', 'Smiles', 'Prediction'];






  constructor(

    private selectedModelsStateService: SelectedModelsStateService,
    private smilesStateService: SmilesStateService,
    private fb: FormBuilder

  ) {

    this.form = this.fb.group({some_array: this.fb.array([])});
  
   }






  ngOnInit() {

    this.selectedModelsStateService.selectedModelsChange$.subscribe(selected_models => {
      
      
      this.selectedModels = selected_models;


    });  
    
    
    this.smilesStateService.smilesChange$.subscribe(smile => {
      
      
      this.selected_smile = smile;
      console.log(this.selected_smile);

    });    

    
    this.modelControl = new FormControl();

  }




}




