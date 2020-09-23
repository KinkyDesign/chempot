import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import '../rxjs-operators';
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';
import { Dataset } from '../model/dataset';
import { Config } from '../../config/config';
// import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MetaInfo, Model, Task } from '../model/models';
// import { Domain } from 'domain';



@Injectable()
export class ModelApiService extends BaseClient<Model>{

    _privateBasePath:string;
    _modelBase:string = "/model/"

    constructor(http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/model/")
        }

    public putMeta(model:Model):Observable<MetaInfo>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("query", "UNREAD");
        let pathFormed = Config.JaqpotBase + this._modelBase + model._id + "/meta"
        return this.http.put(pathFormed, model, { headers: headers} ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public predict(modelId:string, datasetUri:string, visible, doa:boolean):Observable<Task>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._modelBase + modelId 
        let body = new HttpParams();
        body = body.set('dataset_uri', datasetUri);
        body = body.set('visible', visible);
        body = body.set('doa', doa.toString())
        return this.http.post(pathFormed, body.toString(), { headers:headers }).pipe(
            tap((res : Response) =>{
                return res;
            }),catchError( err => this.dialogsService.onError(err) )
        )
    }

    public updateOnTrash(modelId:string, model:Model):Observable<Model>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._modelBase + modelId + '/ontrash';
        return this.http.put(pathFormed, model, { headers:headers }).pipe(
            tap((res : Response) =>{
                return res;
            }),catchError( err => this.dialogsService.onError(err) )
        )

    }
     
    // I do no need one more getList method, because the modelApiService class EXTENDS the getList of the abstract base class
    // , which can do exactly what I want as it is!!!!!!!!!!!!!!!!!!!! So when I call getList from the modelApiService 
    // it will be the getList of the abstract BaseClient getList method that will be called and recognized. This method 
    // is able to do exactly what I want. If the abstract method could not do what I wanted, then I should make a more
    // specific method inside the modelApiService, but now that it can I should not create again a new getList inside the 
    // modelApiService, but instead I should use the getList method of the abstract class BaseClient. The key issue to remember 
    // is that becasue modelApiService extends the BaseClient, all of the BaseClient methods are also methods of the 
    // modelApiService, which only makes more specific the type of object on which the abstract methods will be applied to,
    // which in our case is type of Model!

    // // added by Pol at 20200822
    // public getList(params:HttpParams): Observable<[Model]> {
    
    //     const token = this.oidcSecurityService.getToken();
    //     const tokenValue = 'Bearer ' + token;
    //     let headers = new HttpHeaders({'Content-Type':'application/json'}).set('Authorization', tokenValue);
    //     let pathFormed = Config.JaqpotBase + this._modelBase;
    //     return this.http.get(pathFormed, {headers: headers, params:params}).pipe(
    //         tap((res:Response) => {
    //             return res.json
    //         }),catchError(err => this.dialogsService.onError(err))
    //     );
    
    // }
    // added by Pol at 20200822


}

// /**
//  * Jaqpot API
//  * Jaqpot v4 (Quattro) is the 4th version of a YAQP, a RESTful web service which can be used to train machine learning models and use them to obtain toxicological predictions for given chemical compounds or engineered nano materials. The project is written in Java8 and JEE7.
//  *
//  * OpenAPI spec version: 4.0.3
//  * Contact: hampos@me.com
//  *
//  * NOTE: This class is auto generated by the swagger code generator program.
//  * https://github.com/swagger-api/swagger-codegen.git
//  * Do not edit the class manually.
//  */



// /* tslint:disable:no-unused-variable member-ordering */

// import { Inject, Injectable, Optional }                      from '@angular/core';
// import { Http, Headers, URLSearchParams }                    from '@angular/http';
// import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
// import { Response, ResponseContentType }                     from '@angular/http';

// import { Observable }                                        from 'rxjs/Observable';
// import '../rxjs-operators';

// import { Model } from '../model/model';
// import { Task } from '../model/task';

// import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
// import { Configuration }                                     from '../configuration';


// @Injectable()
// export class ModelService {

//     protected basePath = 'http://dev.jaqpot.org:8081/jaqpot/services';
//     public defaultHeaders: Headers = new Headers();
//     public configuration: Configuration = new Configuration();

//     constructor(protected http: Http, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
//         if (basePath) {
//             this.basePath = basePath;
//         }
//         if (configuration) {
//             this.configuration = configuration;
// 			this.basePath = basePath || configuration.basePath || this.basePath;
//         }
//     }

//     /**
//      *
//      * Extends object by coping non-existing properties.
//      * @param objA object to be extended
//      * @param objB source object
//      */
//     private extendObj<T1,T2>(objA: T1, objB: T2) {
//         for(let key in objB){
//             if(objB.hasOwnProperty(key)){
//                 (objA as any)[key] = (objB as any)[key];
//             }
//         }
//         return <T1&T2>objA;
//     }

//     /**
//      * @param consumes string[] mime-types
//      * @return true: consumes contains 'multipart/form-data', false: otherwise
//      */
//     private canConsumeForm(consumes: string[]): boolean {
//         const form = 'multipart/form-data';
//         for (let consume of consumes) {
//             if (form === consume) {
//                 return true;
//             }
//         }
//         return false;
//     }

//     /**
//      * Deletes a particular Model resource
//      * Deletes a Model of a given ID. The method is idempondent, that is it can be used more than once without triggering an exception/error. If the Model does not exist, the method will return without errors. Authentication and authorization requirements apply, so clients that are not authenticated with a valid token or do not have sufficient priviledges will not be able to delete Models using this method.
//      * @param id ID of the Model.
//      * @param subjectid Clients need to authenticate in order to create resources on the server
//      */
//     public deleteModel(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<undefined> {
//         return this.deleteModelWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204 || response.status ===  200)  {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds Model by Id
//      * Finds specified Model
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public getModel(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Model> {
//         return this.getModelWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds Model by Id
//      * Finds specified Model
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public getModelPmml(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.getModelPmmlWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds all Models
//      * Finds featured Models from Jaqpot database. The response will list all models and will return either a URI list of a list of JSON model objects. In the latter case, only the IDs, metadata, ontological classes and reliability of the models will be returned. Use the parameters start and max to get paginated results.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listFeaturedModels(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listFeaturedModelsWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Lists the dependent features of a Model
//      * Lists the dependent features of a Model identified by its ID. The result is available as a URI list.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public listModelDependentFeatures(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listModelDependentFeaturesWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Lists the independent features of a Model
//      * Lists the independent features of a Model. The result is available as a URI list.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public listModelIndependentFeatures(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listModelIndependentFeaturesWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Lists the dependent features of a Model
//      * Lists the predicted features of a Model identified by its ID. The result is available as a URI list.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public listModelPredictedFeatures(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listModelPredictedFeaturesWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Lists the required features of a Model
//      * Lists the required features of a Model identified by its ID. The result is available as a URI list.
//      * @param id
//      * @param subjectId
//      */
//     public listModelRequiredFeatures(id: string, subjectId?: string, extraHttpRequestParams?: any): Observable<Array<string>> {
//         return this.listModelRequiredFeaturesWithHttpInfo(id, subjectId, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds all Models
//      * Finds all Models from Jaqpot Dataset. The response will list all models and will return either a URI list of a list of JSON model objects. In the latter case, only the IDs, metadata, ontological classes and reliability of the models will be returned. Use the parameters start and max to get paginated results.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listModels(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listModelsWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates Prediction
//      * Creates Prediction
//      * @param datasetUri
//      * @param id
//      * @param visible
//      * @param subjectid
//      */
//     public makePrediction(datasetUri: string, id: string, visible?: boolean, subjectid?: string, extraHttpRequestParams?: any): Observable<Task> {
//         return this.makePredictionWithHttpInfo(datasetUri, id, visible, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }


//     /**
//      * Deletes a particular Model resource
//      * Deletes a Model of a given ID. The method is idempondent, that is it can be used more than once without triggering an exception/error. If the Model does not exist, the method will return without errors. Authentication and authorization requirements apply, so clients that are not authenticated with a valid token or do not have sufficient priviledges will not be able to delete Models using this method.
//      * @param id ID of the Model.
//      * @param subjectid Clients need to authenticate in order to create resources on the server
//      */
//     public deleteModelWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling deleteModel.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];

//       headers.set('Content-Type', 'application/json');

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Delete,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Finds Model by Id
//      * Finds specified Model
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public getModelWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getModel.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list',
//             'application/ld+json'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Finds Model by Id
//      * Finds specified Model
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public getModelPmmlWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}/pmml'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getModelPmml.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/xml'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Finds all Models
//      * Finds featured Models from Jaqpot database. The response will list all models and will return either a URI list of a list of JSON model objects. In the latter case, only the IDs, metadata, ontological classes and reliability of the models will be returned. Use the parameters start and max to get paginated results.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listFeaturedModelsWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/featured';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (start !== undefined) {
//             queryParameters.set('start', <any>start);
//         }

//         if (max !== undefined) {
//             queryParameters.set('max', <any>max);
//         }

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Lists the dependent features of a Model
//      * Lists the dependent features of a Model identified by its ID. The result is available as a URI list.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public listModelDependentFeaturesWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}/dependent'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling listModelDependentFeatures.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'text/uri-list'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Lists the independent features of a Model
//      * Lists the independent features of a Model. The result is available as a URI list.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public listModelIndependentFeaturesWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}/independent'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling listModelIndependentFeatures.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'text/uri-list'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Lists the dependent features of a Model
//      * Lists the predicted features of a Model identified by its ID. The result is available as a URI list.
//      * @param id
//      * @param subjectid Clients need to authenticate in order to access models
//      */
//     public listModelPredictedFeaturesWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}/predicted'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling listModelPredictedFeatures.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'text/uri-list'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Lists the required features of a Model
//      * Lists the required features of a Model identified by its ID. The result is available as a URI list.
//      * @param id
//      * @param subjectId
//      */
//     public listModelRequiredFeaturesWithHttpInfo(id: string, subjectId?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}/required'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling listModelRequiredFeatures.');
//         }
//         if (subjectId !== undefined && subjectId !== null) {
//             headers.set('subjectId', String(subjectId));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Finds all Models
//      * Finds all Models from Jaqpot Dataset. The response will list all models and will return either a URI list of a list of JSON model objects. In the latter case, only the IDs, metadata, ontological classes and reliability of the models will be returned. Use the parameters start and max to get paginated results.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listModelsWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (start !== undefined) {
//             queryParameters.set('start', <any>start);
//         }

//         if (max !== undefined) {
//             queryParameters.set('max', <any>max);
//         }

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];


//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Get,
//             headers: headers,
//             search: queryParameters,
//             withCredentials:this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Creates Prediction
//      * Creates Prediction
//      * @param datasetUri
//      * @param id
//      * @param visible
//      * @param subjectid
//      */
//     public makePredictionWithHttpInfo(datasetUri: string, id: string, visible?: boolean, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/model/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'datasetUri' is not null or undefined
//         if (datasetUri === null || datasetUri === undefined) {
//             throw new Error('Required parameter datasetUri was null or undefined when calling makePrediction.');
//         }
//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling makePrediction.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Content-Type header
//         let consumes: string[] = [
//             'application/x-www-form-urlencoded'
//         ];
//         let canConsumeForm = this.canConsumeForm(consumes);
//         let useForm = false;
    //     let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
    //       set(param: string, value: any): void;
    //     };

    //     // to determine the Accept header
    //     let produces: string[] = [
    //         'application/json'
    //     ];

    //   headers.set('Content-Type', 'application/x-www-form-urlencoded');

    //   if (datasetUri !== undefined) {
    //         formParams.set('dataset_uri', <any>datasetUri);
    //     }

    //     if (visible !== undefined) {
    //         formParams.set('visible', <any>visible);
    //     }

    //     let requestOptions: RequestOptionsArgs = new RequestOptions({
    //         method: RequestMethod.Post,
    //         headers: headers,
    //         body: formParams.toString(),
    //         search: queryParameters,
    //         withCredentials:this.configuration.withCredentials
    //     });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

// }