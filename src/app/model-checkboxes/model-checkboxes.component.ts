import { Component, OnInit } from '@angular/core';
import { ModelApiService } from '../jaqpot-client/api/model.service';
import { HttpParams } from '@angular/common/http';
import { Model } from '../jaqpot-client/model/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SelectedModelsStateService } from './selectedModels-state.service'


@Component({
  selector: 'app-model-checkboxes',
  templateUrl: './model-checkboxes.component.html',
  styleUrls: ['./model-checkboxes.component.scss'],
  providers: [ModelApiService]
})
export class ModelCheckboxes implements OnInit {

  
  models_to_view: Model[];
  selected_models: Model[] | null;
  checkArray: Model[] = [];
  min: number;
  max: number; 
  organization = "LamaRed";
  form: FormGroup;
  modelControl: FormControl;

  constructor(
    private modelApiService: ModelApiService,
    private fb: FormBuilder,
    private selectedModelsStateService: SelectedModelsStateService
  ) {
    this.form = this.fb.group({some_array: this.fb.array([])});
    this.selectedModelsStateService.changeSelectedModels(this.selected_models);
   }

  ngOnInit() {



    this.modelControl = new FormControl();

    // let params = new HttpParams().set("start", this.min.toString()).set("max", this.max.toString()).set("organization", this.organization);
    let params = new HttpParams().set("organization", this.organization);
   
    // https://egghead.io/lessons/angular-fetch-data-from-an-api-using-the-httpclient-in-angular
    // https://stackoverflow.com/questions/46767880/what-does-subscribe-do-and-how-it-is-related-to-observable
    this.modelApiService.getList(params).subscribe(
      (models:Model[]) => {
        this.models_to_view = models;
      },
      error => console.log(error)
    );


  }



  // https://stackoverflow.com/questions/51476599/checkbox-object-in-angular
  onCheckboxChange(event: Model): void{

    if (this.checkArray != []){
      if (this.checkArray.includes(event)) {
        this.checkArray.splice(this.checkArray.indexOf(event));
      } else {
        this.checkArray.push(event);
      }

      this.selected_models = this.checkArray;
      }else{
        this.selected_models = null;
    }

    // console.log(this.selected_models);
    // console.log(this.selectedModelsStateService.changeSelectedModels(this.selected_models));

    this.selectedModelsStateService.changeSelectedModels(this.selected_models);

}






// // https://www.positronx.io/angular-checkbox-tutorial/
  // onCheckboxChange(event: any){

  //       const checkArray: FormArray = this.form.get('checkArray') as FormArray;
  //       if (event.target.checked) {
  //         checkArray.push(new FormControl(event.target.value));
  //       } else {
  //         let i: number = 0;
  //         checkArray.controls.forEach((item: FormControl) => {
  //           if (item.value == event.target.value) {
  //             checkArray.removeAt(i);
  //             return;
  //           }
  //           i++;
  //         });
  //       }

  //       // if (this.selected_models.includes(event)) {
  //       //   this.selected_models.splice(this.selected_models.indexOf(event));
  //       // } else {
  //       //   this.selected_models.push(event);
  //       // }

  //       this.selected_models = checkArray.value;

  // }



  // submitForm() {
  //   console.log(this.selected_models);
  // }


  // checkValue(event: any){
  //   console.log(event);
  // }




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //   /**
    //  * Finds all Models
    //  * Finds featured Models from Jaqpot database. The response will list all models and will return either a URI list of a list of JSON model objects. In the latter case, only the IDs, metadata, ontological classes and reliability of the models will be returned. Use the parameters start and max to get paginated results.
    //  * @param subjectid Authorization token
    //  * @param start start
    //  * @param max max - the server imposes an upper limit of 500 on this parameter.
    //  */
    // public listFeaturedModelsWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
    //     const path = this.basePath + '/model/featured';

    //     let queryParameters = new URLSearchParams();
    //     let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

    //     if (start !== undefined) {
    //         queryParameters.set('start', <any>start);
    //     }

    //     if (max !== undefined) {
    //         queryParameters.set('max', <any>max);
    //     }

    //     if (subjectid !== undefined && subjectid !== null) {
    //         headers.set('subjectid', String(subjectid));
    //     }


    //     // to determine the Accept header
    //     let produces: string[] = [
    //         'application/json',
    //         'text/uri-list'
    //     ];


    //     let requestOptions: RequestOptionsArgs = new RequestOptions({
    //         method: RequestMethod.Get,
    //         headers: headers,
    //         search: queryParameters,
    //         withCredentials:this.configuration.withCredentials
    //     });
    //     // https://github.com/swagger-api/swagger-codegen/issues/4037
    //     if (extraHttpRequestParams) {
    //         requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
    //     }

    //     return this.http.request(path, requestOptions);
    // }






    // /**
    //  * Finds all Models
    //  * Finds featured Models from Jaqpot database. The response will list all models and will return either a URI list of a list of JSON model objects. In the latter case, only the IDs, metadata, ontological classes and reliability of the models will be returned. Use the parameters start and max to get paginated results.
    //  * @param subjectid Authorization token
    //  * @param start start
    //  * @param max max - the server imposes an upper limit of 500 on this parameter.
    //  */
    // public listFeaturedModels(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
    //     return this.listFeaturedModelsWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
    //         .map((response: Response) => {
    //             if (response.status === 204) {
    //                 return undefined;
    //             } else {
    //                 return response.json() || {};
    //             }
    //         });
    // }


}







