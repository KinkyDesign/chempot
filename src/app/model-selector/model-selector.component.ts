import { Component, OnInit } from '@angular/core';
import { Model } from '../jaqpot-client/model/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { SelectedModelsStateService } from '../model-checkboxes/selectedModels-state.service';
// import { Observable, BehaviorSubject } from 'rxjs'
// import { ModelApiService } from '../jaqpot-client/api/model.service';



@Component({
  selector: 'app-model-selector',
  templateUrl: './model-selector.component.html',
  styleUrls: ['./model-selector.component.scss'],
  // providers: [SelectedModelsStateService]
  // 
})
export class ModelSelector implements OnInit {

  form: FormGroup;
  modelControl: FormControl;
  selectedModels: Model[] | null;







  constructor(

    private selectedModelsStateService: SelectedModelsStateService,
    private fb: FormBuilder

  ) {

    this.form = this.fb.group({some_array: this.fb.array([])});

  
   }






  ngOnInit() {

    this.selectedModelsStateService.selectedModelsChange$.subscribe(selected_models => this.selectedModels = selected_models);    
    console.log(this.selectedModelsStateService.selectedModelsChange$.subscribe(selected_models => this.selectedModels = selected_models));

    this.modelControl = new FormControl();

  }




  // newSelectedModels():Model[]{

     
  //   console.log(this.modelsStateService.changeSelectedModelsMessage(this.selected_models).value);

  //   return this.modelsStateService.changeSelectedModelsMessage(this.selected_models).value

  // }



}




