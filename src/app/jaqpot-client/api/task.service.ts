import {throwError as observableThrowError,  Observable, interval } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import '../rxjs-operators';
import { map, filter, catchError, mergeMap, tap, retryWhen } from 'rxjs/operators';
import { Dataset } from '../model/dataset';
import { Config } from '../../config/config';
// import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MetaInfo, Model, Task } from '../model/models';



@Injectable()
export class TaskApiService extends BaseClient<Task>{

    _privateBasePath:string;
    private dataset:Dataset;
    _modelBase:string = "/task/"

    constructor(http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/task/")
    }

    public getTask(taskId:string):Observable<Task>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._modelBase + taskId
        return this.http.get(pathFormed, {headers:headers})
        
    }



}

// import { Inject, Injectable, Optional }                      from '@angular/core';
// import { Http, Headers, URLSearchParams }                    from '@angular/http';
// import { RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';
// import { Response, ResponseContentType }                     from '@angular/http';

// import { Observable }                                        from 'rxjs/Observable';
// import '../rxjs-operators';

// import { Task } from '../model/task';

// import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
// import { Configuration }                                     from '../configuration';


// @Injectable()
// export class TaskService {

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
//      * Deletes a Task of given ID
//      * Deletes a Task given its ID in the URI. When the DELETE method is applied, the task is interrupted and tagged as CANCELLED. Note that this method does not return a response on success. If the task does not exist, an error report will be returned to the client accompanied by an HTTP status code 404. Note also that authentication and authorization restrictions apply, so clients need to be authenticated with a valid token and have appropriate rights to be able to successfully apply this method.
//      * @param id ID of the task which is to be cancelled.
//      * @param subjectid
//      */
//     public deleteTask(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.deleteTaskWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds Task by Id
//      * Finds specified Task
//      * @param id ID of the task to be retrieved
//      * @param subjectid Authorization token
//      */
//     public getTask(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Task> {
//         return this.getTaskWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds all Tasks
//      * Finds all Tasks from Jaqpot Dataset. One may specify various search criteria such as the task creator of the task status.
//      * @param subjectid Authorization token
//      * @param status Status of the task
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listTasks(subjectid?: string, status?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<{}> {
//         return this.listTasksWithHttpInfo(subjectid, status, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Poll Task by Id
//      * Implements long polling
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public poll(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Task> {
//         return this.pollWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }


//     /**
//      * Deletes a Task of given ID
//      * Deletes a Task given its ID in the URI. When the DELETE method is applied, the task is interrupted and tagged as CANCELLED. Note that this method does not return a response on success. If the task does not exist, an error report will be returned to the client accompanied by an HTTP status code 404. Note also that authentication and authorization restrictions apply, so clients need to be authenticated with a valid token and have appropriate rights to be able to successfully apply this method.
//      * @param id ID of the task which is to be cancelled.
//      * @param subjectid
//      */
//     public deleteTaskWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/task/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling deleteTask.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json'
//         ];


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
//      * Finds Task by Id
//      * Finds specified Task
//      * @param id ID of the task to be retrieved
//      * @param subjectid Authorization token
//      */
//     public getTaskWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/task/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getTask.');
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

//       let requestOptions: RequestOptionsArgs = new RequestOptions({
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
//      * Finds all Tasks
//      * Finds all Tasks from Jaqpot Dataset. One may specify various search criteria such as the task creator of the task status.
//      * @param subjectid Authorization token
//      * @param status Status of the task
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listTasksWithHttpInfo(subjectid?: string, status?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/task';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (status !== undefined) {
//             queryParameters.set('status', <any>status);
//         }

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
//      * Poll Task by Id
//      * Implements long polling
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public pollWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/task/${id}/poll'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling poll.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//         ];
//         headers.set('Content-Type', 'application/octet-stream');


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

// }