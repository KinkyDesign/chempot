import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { ModelApiService } from '../jaqpot-client/api/model.service';
import { HttpParams } from '@angular/common/http';
import { Model } from '../jaqpot-client/model/models';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { map, tap, concatMap } from 'rxjs/operators';
// import { BehaviorSubject, Subscription, Observable } from 'rxjs';
// import { debounceTime } from 'rxjs/operators';
import { SelectedModelsStateService } from './selectedModels-state.service'
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Organization } from '@euclia/accounts-client/dist/models/models';
import { OrganizationService } from '../jaqpot-client/api/organization.service';
import { UserService } from '../jaqpot-client/api/user.service';
import {User} from '@euclia/accounts-client/dist/models/models';
// import { UserService } from 'angular-auth-oidc-client/lib/userData/user-service';

// import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-model-checkboxes',
  templateUrl: './model-checkboxes.component.html',
  styleUrls: ['./model-checkboxes.component.scss'],
})
export class ModelCheckboxes implements OnInit {

  organizationControl: FormControl;
  tagControl: FormControl;
  @ViewChild('paginator1') paginator: MatPaginator;
  all_user_organizations: Organization[] | null = [];
  all_user_organizations_ids: string[];
  all_user_organizations_names: string[];
  all_users: User[] | null = [];
  user: User;
  models_to_view: Model[];
  model_to_view: Model;
  selected_models: Model[] | null = [];
  checkArray: Model[] = [];
  modelsByOrgCounter: any;
  pageEvent: PageEvent;
  pageSize: number;
  pageIndex: number;
  min: number;
  max: number; 
  organization: Organization;
  allSelectedModelsView = false;
  modelsDataSource = new MatTableDataSource();
  models_tags: string[];
  model_tag: string;
  o:Organization;
  e:PageEvent;
  tag:string;
  // t: string;

  // form: FormGroup;
  // modelControl: FormControl;

  constructor(
    private modelApiService: ModelApiService,
    private selectedModelsStateService: SelectedModelsStateService,
    private orgService: OrganizationService,
    private userService: UserService
    // private fb: FormBuilder,
  ) {
    this.selectedModelsStateService.changeSelectedModels(this.selected_models);
    // this.form = this.fb.group({some_array: this.fb.array([])});
   }


  // https://stackoverflow.com/questions/50753628/what-is-the-difference-between-angular-ngoninit-and-ngonchanges
  ngOnInit() {

    this.getAllUserOrganizations();
    this.getModels(null);
    this.modelsDataSource.paginator = this.paginator;
    this.organizationControl = new FormControl();
    this.tagControl = new FormControl();

    this.pageIndex = 0;
    this.pageSize = 5;
    this.min = this.pageSize*(this.pageIndex);
    this.max = this.min + (this.pageSize);


    // this.modelControl = new FormControl();
  }





  public getAllUserOrganizations(){

    this.userService.getUserById(JSON.parse(localStorage.getItem('chempot_userData'))["sub"]).then(
      u => {
        this.user = u;
        // console.log(this.user);
        this.all_user_organizations_ids = this.user.organizations;
        this.user.organizations.forEach(
          (o:string) => {
            this.orgService.getOrgById(o).then((o:Organization) => 
            {
              this.all_user_organizations.push(o);
             }
            )
          }
        )
         
       }

    )

  }





  // public getModelsTotalNumberAndTagsByOrganization(o:Organization){
  //   if(o){

  //   this.organization = o;
  //   let params = new HttpParams().set("organization", this.organization._id);
  //   // https://stackoverflow.com/questions/37364973/what-is-the-difference-between-promises-and-observables
  //   // https://egghead.io/lessons/angular-fetch-data-from-an-api-using-the-httpclient-in-angular
  //   // https://stackoverflow.com/questions/46767880/what-does-subscribe-do-and-how-it-is-related-to-observable
  //   this.modelApiService.count<Model>(params).subscribe(
  //     total => this.modelsByOrgCounter = total.headers.get('total')
  //     );
      
  //   ////////////////////////// this part needs to be tested with non empty tags////////////////////////
  //   //  this.modelApiService.getList(params).subscribe(
  //   //           (models:Model[]) => {
  //   //           this.models_to_view = models;

  //   //           this.models_to_view.forEach((model_to_view: Model) => {
                
  //   //             if(model_to_view.meta.tags){
  //   //             model_to_view.meta.tags.forEach((model_tag:string) => {
                
  //   //               this.models_tags.push(model_tag);

  //   //              })
  //   //          }else{

  //   //               this.models_tags = [''];
  //   //             }
  //   //           });


  //   //         }
  //   //        );
  //   ////////////////////////// this part needs to be tested with non empty tags////////////////////////

  //   this.models_tags = ['mordred', 'cdk'];


  //   }


  // }




  public getModelsTotalNumberByOrganization(o:Organization){
    if(o){

    this.organization = o;
    let params = new HttpParams().set("organization", this.organization._id);
    // https://stackoverflow.com/questions/37364973/what-is-the-difference-between-promises-and-observables
    // https://egghead.io/lessons/angular-fetch-data-from-an-api-using-the-httpclient-in-angular
    // https://stackoverflow.com/questions/46767880/what-does-subscribe-do-and-how-it-is-related-to-observable
    this.modelApiService.count<Model>(params).subscribe(
      total => this.modelsByOrgCounter = total.headers.get('total')
      );
      


    }


  }









  // public getModelsByOrganizationAndTag(o: Organization, e?:PageEvent, t?:string) {


  //  if(e && o && (!t||(t = ''))){

  //   this.pageIndex = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.min = this.pageSize*(this.pageIndex);
  //   this.max = this.min + (this.pageSize);

  //   let params = new HttpParams().set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
    
  //   this.modelApiService.getList(params).subscribe(
  //     (models:Model[]) => {
  //       this.models_to_view = models;
  //       this.modelsDataSource.data = this.models_to_view;
  //     }
  //   );
  //   return e;

  //  }else if(!e && o && (!t||(t = ''))){

  //    this.pageIndex = 0;
  //    this.pageSize = 5;
  //    this.min = this.pageSize*(this.pageIndex);
  //    this.max = this.min + (this.pageSize);
 
  //    let params = new HttpParams().set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
    
  //    this.modelApiService.getList(params).subscribe(
  //      (models:Model[]) => {
  //        this.models_to_view = models;
  //        this.modelsDataSource.data = this.models_to_view;

  //      }
  //    );

  //    return null;
 
  //  }else if(e && o && (t && (t != ''))){

  //   this.pageIndex = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.min = this.pageSize*(this.pageIndex);
  //   this.max = this.min + (this.pageSize);

  //   let params = new HttpParams().set("tag", this.t).set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
   
  //   this.modelApiService.getList(params).subscribe(
  //     (models:Model[]) => {
  //       this.models_to_view = models;
  //       this.modelsDataSource.data = this.models_to_view;

  //     }
  //   );

  //   return e;

  //  }else if(!e && o && (t && (t != ''))){

  //   this.pageIndex = 0;
  //   this.pageSize = 5;
  //   this.min = this.pageSize*(this.pageIndex);
  //   this.max = this.min + (this.pageSize);

  //   let params = new HttpParams().set("tag", this.t).set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
   
  //   this.modelApiService.getList(params).subscribe(
  //     (models:Model[]) => {
  //       this.models_to_view = models;
  //       this.modelsDataSource.data = this.models_to_view;


  //     }
  //   );
    
  //   return null;

  //  }else if(!e && o && (t && (t = ''))){

  //   this.pageIndex = 0;
  //   this.pageSize = 5;
  //   this.min = this.pageSize*(this.pageIndex);
  //   this.max = this.min + (this.pageSize);

  //   let params = new HttpParams().set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
   
  //   this.modelApiService.getList(params).subscribe(
  //     (models:Model[]) => {
  //       this.models_to_view = models;
  //       this.modelsDataSource.data = this.models_to_view;


  //     }
  //   );

  //   return null;

  //  }else if(e && o && (t && (t = ''))){

  //   this.pageIndex = e.pageIndex;
  //   this.pageSize = e.pageSize;
  //   this.min = this.pageSize*(this.pageIndex);
  //   this.max = this.min + (this.pageSize);

  //   let params = new HttpParams().set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
   
  //   this.modelApiService.getList(params).subscribe(
  //     (models:Model[]) => {
  //       this.models_to_view = models;
  //       this.modelsDataSource.data = this.models_to_view;


  //     }
  //   );

  //   return e;

  //  }
  // }



  // public getModelsByOrganizationAndTag(o?: Organization, e?:PageEvent, tag?:string) {
  //     if(o && tag){


  //       this.pageIndex = 0;
  //       this.pageSize = 5;
  //       this.min = this.pageSize*(this.pageIndex);
  //       this.max = this.min + (this.pageSize);

  //       let tag_ = tag;
  //       console.log(tag_);
  //       let params = new HttpParams().set("tag", tag_).set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
       
  //       this.modelApiService.getList(params).subscribe(
  //         (models:Model[]) => {
  //           this.models_to_view = models;
  //           this.modelsDataSource.data = this.models_to_view;
    
    
  //         }
  //       );

    
        
  //     }else if(o && tag && e){

  //       this.pageIndex = e.pageIndex;
  //       this.pageSize = e.pageSize;
  //       this.min = this.pageSize*(this.pageIndex);
  //       this.max = this.min + (this.pageSize);

  //       let tag_ = tag;
  //       console.log(tag_);
  //       let params = new HttpParams().set("tag", tag_).set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
       
  //       this.modelApiService.getList(params).subscribe(
  //         (models:Model[]) => {
  //           this.models_to_view = models;
  //           this.modelsDataSource.data = this.models_to_view;
    
    
  //         }
  //       );


  //      }


  // }




  public getModelsByOrganization(o?: Organization, e?:PageEvent,) {
    if(o&&e){


      this.pageIndex = e.pageIndex;
      this.pageSize = e.pageSize;
      this.min = this.pageSize*(this.pageIndex);
      this.max = this.min + (this.pageSize);

      let params = new HttpParams().set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
     
      this.modelApiService.getList(params).subscribe(
        (models:Model[]) => {
          this.models_to_view = models;
          this.modelsDataSource.data = this.models_to_view;
          console.log(this.modelsDataSource.data)
  
        }
      );

      return e;
      
      
    }else if(o&&!e){

      this.pageIndex = 0;
      this.pageSize = 5;
      this.min = this.pageSize*(this.pageIndex);
      this.max = this.min + (this.pageSize);

      let params = new HttpParams().set("organization", o._id).set("start", this.min.toString()).set("max", this.max.toString());
     
      this.modelApiService.getList(params).subscribe(
        (models:Model[]) => {
          this.models_to_view = models;
          this.modelsDataSource.data = this.models_to_view;
          console.log(this.modelsDataSource.data)
  
        }
      );
      
    }


}







  public getModels(o:Organization, e?:PageEvent, tag?:string){
    this.getModelsTotalNumberByOrganization(o);
    this.getModelsByOrganization(o, e);
    // this.getModelsTotalNumberAndTagsByOrganization(o);
    // this.getModelsByOrganizationAndTag(o, e, tag);
    // this.getModelsTagsByOrganization();
  }
  
  

  public showAllSelectedModels(){
      this.allSelectedModelsView = ! this.allSelectedModelsView;
  }




  // https://stackoverflow.com/questions/51476599/checkbox-object-in-angular
  public onCheckboxChange(event: Model): void{
    
    
    if (this.checkArray.some(x => (x._id === event._id))) {
      this.checkArray.splice(this.checkArray.findIndex(x => x._id === event._id),1);
    } else {
      this.checkArray.push(event);
    }



    // JSON.parse(JSON.stringify()) does a deep copy of the checkarray object
    this.selected_models = JSON.parse(JSON.stringify(this.checkArray));
      
    // console.log(this.selected_models);
    // console.log(this.selectedModelsStateService.changeSelectedModels(this.selected_models));
    // console.log(JSON.parse(JSON.stringify(this.checkArray)));
    this.selectedModelsStateService.changeSelectedModels(this.selected_models);

  }


  public checkboxSelected(model_to_view: Model) {

    if(this.selected_models.some(x => (x._id === model_to_view._id))){
    return true;
    }else{
      return false
    }
    

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







