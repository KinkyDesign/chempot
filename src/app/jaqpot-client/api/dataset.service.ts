import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import '../rxjs-operators';
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';
import { Dataset } from '../model/dataset';
import { ErrorReport } from '../model/errorReport';
import { Task } from '../model/task';

// import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Config } from '../../config/config';
// import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MetaInfo } from '../model/models';



@Injectable()
export class DatasetService extends BaseClient<Dataset>{

    // private _basePath : string;
    // private _defaultHeaders: Headers = new Headers();

    _privateBasePath:string;
    private dataset:Dataset;
    _datasetBase:string = "/dataset/"

    private _allDatasetsEndpoint:string;
    private _allFeaturedDatasetsEndpoint:string
    private _createDatasetEndpoint:string;
    private _createDatasetFromCsvEndpoint:string;
    private _createEmptyDatasetEndpoint:string;
    private _getFeaturedDatasetsEndpoint:string;
    private _mergeDatasetsEndpoint:string;
    private _deleteDatasetEndpoint:string;
    private _getDatasetByIdEndpoint:string;
    private _getDatasetFeaturesEndpoint:string;
    private _getDatasetMetaEndpoint:string;
    private _createQPRFEndpoint:string;


    constructor(http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/dataset/")
        }

    public uploadNewDatasetForPrediction(dataset:Dataset):Observable<Dataset>{
            dataset.existence = Dataset.ExistenceEnum.FORPREDICTION
            const token = this.oidcSecurityService.getToken();
            const tokenValue = 'Bearer ' + token;
            let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
            let pathFormed = Config.JaqpotBase + this._datasetBase
            return this.http.post(pathFormed, dataset, { headers: headers} ).pipe(
                tap((res : Response) => { 
                    return res           
                }),catchError( err => this.dialogsService.onError(err) )
            );
    }


    public uploadNewDataset(dataset:Dataset):Observable<Dataset>{
        dataset.existence = Dataset.ExistenceEnum.UPLOADED
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._datasetBase
        return this.http.post(pathFormed, dataset, { headers: headers} ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public putMeta(dataset:Dataset):Observable<MetaInfo>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("query", "UNREAD");
        let pathFormed = Config.JaqpotBase + this._datasetBase + dataset._id + "/meta"
        return this.http.put(pathFormed, dataset, { headers: headers} ).pipe(
            tap((res : Response) => { 
                return res           
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }
    
    public getDataEntryPaginated(datasetId:string, start:number, max:number){
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set('dataEntries', 'true').set('rowStart', start.toString()).set('rowMax', max.toString());
        let pathFormed = Config.JaqpotBase + this._datasetBase + datasetId
        return this.http.get(pathFormed, { headers: headers, params: params} ).pipe(
            tap((res : Response) => { 
                return res            
            }),catchError( err => this.dialogsService.onError(err) )
        );
    }

    public updateOnTrash(datasetId:string, dataset:Dataset):Observable<Dataset>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._datasetBase + datasetId + '/ontrash';
        return this.http.put(pathFormed, dataset, { headers:headers }).pipe(
            tap((res : Response) =>{
                return res;
            }),catchError( err => this.dialogsService.onError(err) )
        )
    }


}
    // public getFeaturedDatasets(start?: number, max?: number): Observable<Array<Dataset>> {
    //     let params = new URLSearchParams();
    //     params.set('start', start.toString());
    //     params.set('max', max.toString());
        
    //     let headers = new Headers({'Content-Type':'application/json'});
    //     headers.set('subjectid', this._subjectId);

    //     return this.http.get(this._allFeaturedDatasetsEndpoint, { headers: headers, search: params }).pipe(
    //         map((res : Response) => {
    //             return res.json();
    //         }),catchError(this.dialogsService.onError));
        
    // }

    // public getAllDatasets(start?: number, max?: number): Observable<Array<Dataset>> {
    //     let params = new URLSearchParams();
    //     params.set('start', start.toString());
    //     params.set('max', max.toString());
        
    //     let headers = new Headers({'Content-Type':'application/json'});
    //     headers.set('subjectid', this._subjectId);

    //     return this.http.get(this._allDatasetsEndpoint, { headers: headers, search: params }).pipe(
    //         map((res : Response) => {
    //             return res.json();
    //         }),catchError(this.dialogsService.onError));
        
    // }

    // public getFeaturedDatasetCount(): Observable<Response> {
    //     let params = new URLSearchParams();
    //     params.set('start', '0');
    //     params.set('max', '1');
        
    //     let headers = new Headers({'Content-Type':'application/json'});
    //     headers.set('subjectid', this._subjectId);

    //     return this.http.get(this._allFeaturedDatasetsEndpoint, { headers: headers, search: params }).pipe(
    //         map((res : Response) => {
    //             return res;
    //         }), catchError(this.dialogsService.onError));
        
    // }

    // public getAllDatasetCount(): Observable<Response> {
    //     let params = new URLSearchParams();
    //     params.set('start', '0');
    //     params.set('max', '1');
        
    //     let headers = new Headers({'Content-Type':'application/json'});
    //     headers.set('subjectid', this._subjectId);

    //     return this.http.get(this._allDatasetsEndpoint, { headers: headers, search: params }).pipe(
    //         map((res : Response) => {
    //             return res;
    //         }), catchError(this.dialogsService.onError));
        
    // }

    // /**
    //  * Finds Dataset by Id
    //  * Finds specified Dataset
    //  * @param id
    //  * @param subjectid Authorization token
    //  * @param rowStart: number 
    //  * @param rowMax :number
    //  * @param colStart :number
    //  * @param colMax :number
    //  * @param stratify :string
    //  * @param seed :number
    //  * @param folds :number
    //  * @param targetFeature :string
    //  */
    // public getDataset(id: string,
    //                 queryParams :Map<string, any>): Observable<Dataset> {

    //     let params = new URLSearchParams();
    //     if(queryParams != null){
            
    //         queryParams.forEach((key:string, value:any) =>{
    //             params.set(key, value.toString());
    //         })
    //     }
        
    //     let headers = new Headers({'Content-Type':'application/json'});
    //     headers.set('subjectid', this._subjectId);
    //     let options = new RequestOptions({ headers: headers, params: params });
    //     return this.http.get(this._basePath + `/dataset/${id}`, options).pipe(
    //         map((res : Response) => {
    //             return res.json();
    //         }), catchError((error:any)=>{
    //             return observableThrowError(error);
    //         }));

    // }




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
//      * Creates a new Dataset
//      * The new Dataset created will be assigned on a random generated Id
//      * @param subjectid Authorization token
//      * @param body
//      */
//     public createDataset(subjectid?: string, body?: Dataset, extraHttpRequestParams?: any): Observable<Dataset> {
//         return this.createDatasetWithHttpInfo(subjectid, body, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates dummy dataset By .csv document
//      * Creates dummy features/substances, returns Dataset
//      * @param file xls[m,x] file
//      * @param title Title of dataset
//      * @param description Description of dataset
//      * @param subjectid
//      */
//     public createDummyDataset(file: Blob, title: string, description: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Dataset> {
//         return this.createDummyDatasetWithHttpInfo(file, title, description, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates a new empty Dataset
//      * The new empty Dataset created will be assigned on a random generated Id
//      * @param subjectid Authorization token
//      * @param title
//      * @param description
//      */
//     public createEmptyDataset(subjectid?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<Dataset> {
//         return this.createEmptyDatasetWithHttpInfo(subjectid, title, description, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates QPRF Report
//      *
//      * @param id
//      * @param subjectid Authorization token
//      * @param substanceUri
//      * @param title
//      * @param description
//      */
//     public createQPRFReport(id: string, subjectid?: string, substanceUri?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.createQPRFReportWithHttpInfo(id, subjectid, substanceUri, title, description, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Creates QPRF Dummy Report
//      *
//      * @param id
//      * @param subjectid Authorization token
//      * @param substanceUri
//      * @param title
//      * @param description
//      */
//     public createQPRFReportDummy(id: string, subjectid?: string, substanceUri?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.createQPRFReportDummyWithHttpInfo(id, subjectid, substanceUri, title, description, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Deletes dataset
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public deleteDataset(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<{}> {
//         return this.deleteDatasetWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds Dataset by Id
//      * Finds specified Dataset
//      * @param id
//      * @param subjectid Authorization token
//      * @param rowStart
//      * @param rowMax
//      * @param colStart
//      * @param colMax
//      * @param stratify
//      * @param seed
//      * @param folds
//      * @param targetFeature
//      */
//     public getDataset(id: string, subjectid?: string, rowStart?: number, rowMax?: number, colStart?: number, colMax?: number, stratify?: string, seed?: number, folds?: number, targetFeature?: string, extraHttpRequestParams?: any): Observable<Response> {
//         return this.getDatasetWithHttpInfo(id, subjectid, rowStart, rowMax, colStart, colMax, stratify, seed, folds, targetFeature, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response || {};
//                 }
//             });
//     }

//     /**
//      * Finds Features of Dataset by Id
//      * Finds specified Dataset&#39;s features
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public getDatasetFeatures(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Dataset> {
//         return this.getDatasetFeaturesWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds MetaData of Dataset by Id
//      * Finds specified Dataset&#39;s MetaData
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public getDatasetMeta(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Dataset> {
//         return this.getDatasetMetaWithHttpInfo(id, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds all Datasets
//      * Finds all Datasets in the DB of Jaqpot and returns them in a list. Results can be obtained either in the form of a URI list or as a JSON list as specified by the Accept HTTP header. In the latter case, a list will be returned containing only the IDs of the datasets, their metadata and their ontological classes. The parameter max, which specifies the maximum number of IDs to be listed is limited to 500; if the client specifies a larger value, an HTTP Warning Header will be returned (RFC 2616) with code P670.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listDatasets(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Array<Dataset>> {
//         return this.listDatasetsWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Finds all Datasets
//      * Finds Featured Datasets in the DB of Jaqpot and returns them in a list. Results can be obtained either in the form of a URI list or as a JSON list as specified by the Accept HTTP header. In the latter case, a list will be returned containing only the IDs of the datasets, their metadata and their ontological classes. The parameter max, which specifies the maximum number of IDs to be listed is limited to 500; if the client specifies a larger value, an HTTP Warning Header will be returned (RFC 2616) with code P670.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listFeaturedDatasets(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Array<Dataset>> {
//         return this.listFeaturedDatasetsWithHttpInfo(subjectid, start, max, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }

//     /**
//      * Merges Datasets
//      * The new intersected Dataset created will be assigned on a random generated Id
//      * @param datasetUris
//      * @param subjectid
//      */
//     public mergeDatasets(datasetUris?: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Dataset> {
//         return this.mergeDatasetsWithHttpInfo(datasetUris, subjectid, extraHttpRequestParams)
//             .map((response: Response) => {
//                 if (response.status === 204) {
//                     return undefined;
//                 } else {
//                     return response.json() || {};
//                 }
//             });
//     }


//     /**
//      * Creates a new Dataset
//      * The new Dataset created will be assigned on a random generated Id
//      * @param subjectid Authorization token
//      * @param body
//      */
//     public createDatasetWithHttpInfo(subjectid?: string, body?: Dataset, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'text/uri-list',
//             'application/json'
//         ];


//         headers.set('Content-Type', 'application/json');

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: body == null ? '' : JSON.stringify(body), // https://github.com/angular/angular/issues/10612
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
//      * Creates dummy dataset By .csv document
//      * Creates dummy features/substances, returns Dataset
//      * @param file xls[m,x] file
//      * @param title Title of dataset
//      * @param description Description of dataset
//      * @param subjectid
//      */
//     public createDummyDatasetWithHttpInfo(file: Blob, title: string, description: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/createDummyDataset';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'file' is not null or undefined
//         if (file === null || file === undefined) {
//             throw new Error('Required parameter file was null or undefined when calling createDummyDataset.');
//         }
//         // verify required parameter 'title' is not null or undefined
//         if (title === null || title === undefined) {
//             throw new Error('Required parameter title was null or undefined when calling createDummyDataset.');
//         }
//         // verify required parameter 'description' is not null or undefined
//         if (description === null || description === undefined) {
//             throw new Error('Required parameter description was null or undefined when calling createDummyDataset.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Content-Type header
//         let consumes: string[] = [
//           'multipart/form-data',
//         ];
//         let canConsumeForm = this.canConsumeForm(consumes);
//         let useForm = false;
//         useForm = canConsumeForm;
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//         ];

//       const formData = new FormData();

//         if (file !== undefined) {
//           formData.append('file', <any>file);
//           // formParams.set('file', <any>file);
//         }

//         if (title !== undefined) {
//           formData.append('title', <any>title);
//           // formParams.set('title', <any>title);
//         }

//         if (description !== undefined) {
//           formData.append('description', <any>description);
//           // formParams.set('description', <any>description);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formData,
//             search: queryParameters,
//             withCredentials: this.configuration.withCredentials
//         });
//         // https://github.com/swagger-api/swagger-codegen/issues/4037
//         if (extraHttpRequestParams) {
//             requestOptions = (<any>Object).assign(requestOptions, extraHttpRequestParams);
//         }

//         return this.http.request(path, requestOptions);
//     }

//     /**
//      * Creates a new empty Dataset
//      * The new empty Dataset created will be assigned on a random generated Id
//      * @param subjectid Authorization token
//      * @param title
//      * @param description
//      */
//     public createEmptyDatasetWithHttpInfo(subjectid?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/empty';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Content-Type header
//         let consumes: string[] = [
//             'application/x-www-form-urlencoded'
//         ];
//         let canConsumeForm = this.canConsumeForm(consumes);
//         let useForm = false;
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'text/uri-list',
//             'application/json'
//         ];


//         if (title !== undefined) {
//             formParams.set('title', <any>title);
//         }

//         if (description !== undefined) {
//             formParams.set('description', <any>description);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formParams.toString(),
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
//      * Creates QPRF Report
//      *
//      * @param id
//      * @param subjectid Authorization token
//      * @param substanceUri
//      * @param title
//      * @param description
//      */
//     public createQPRFReportWithHttpInfo(id: string, subjectid?: string, substanceUri?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/${id}/qprf'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling createQPRFReport.');
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
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];


//         if (substanceUri !== undefined) {
//             formParams.set('substance_uri', <any>substanceUri);
//         }

//         if (title !== undefined) {
//             formParams.set('title', <any>title);
//         }

//         if (description !== undefined) {
//             formParams.set('description', <any>description);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formParams.toString(),
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
//      * Creates QPRF Dummy Report
//      *
//      * @param id
//      * @param subjectid Authorization token
//      * @param substanceUri
//      * @param title
//      * @param description
//      */
//     public createQPRFReportDummyWithHttpInfo(id: string, subjectid?: string, substanceUri?: string, title?: string, description?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/${id}/qprf-dummy'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling createQPRFReportDummy.');
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
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];


//         if (substanceUri !== undefined) {
//             formParams.set('substance_uri', <any>substanceUri);
//         }

//         if (title !== undefined) {
//             formParams.set('title', <any>title);
//         }

//         if (description !== undefined) {
//             formParams.set('description', <any>description);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formParams.toString(),
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
//      * Deletes dataset
//      *
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public deleteDatasetWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling deleteDataset.');
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
//      * Finds Dataset by Id
//      * Finds specified Dataset
//      * @param id
//      * @param subjectid Authorization token
//      * @param rowStart
//      * @param rowMax
//      * @param colStart
//      * @param colMax
//      * @param stratify
//      * @param seed
//      * @param folds
//      * @param targetFeature
//      */
//     public getDatasetWithHttpInfo(id: string, subjectid?: string, rowStart?: number, rowMax?: number, colStart?: number, colMax?: number, stratify?: string, seed?: number, folds?: number, targetFeature?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/${id}'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getDataset.');
//         }
//         if (rowStart !== undefined) {
//             queryParameters.set('rowStart', <any>rowStart);
//         }

//         if (rowMax !== undefined) {
//             queryParameters.set('rowMax', <any>rowMax);
//         }

//         if (colStart !== undefined) {
//             queryParameters.set('colStart', <any>colStart);
//         }

//         if (colMax !== undefined) {
//             queryParameters.set('colMax', <any>colMax);
//         }

//         if (stratify !== undefined) {
//             queryParameters.set('stratify', <any>stratify);
//         }

//         if (seed !== undefined) {
//             queryParameters.set('seed', <any>seed);
//         }

//         if (folds !== undefined) {
//             queryParameters.set('folds', <any>folds);
//         }

//         if (targetFeature !== undefined) {
//             queryParameters.set('target_feature', <any>targetFeature);
//         }

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }


//         // to determine the Accept header
//         let produces: string[] = [
//             'text/csv',
//         ];

//         headers.set('Accept', 'text/csv');

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
//      * Finds Features of Dataset by Id
//      * Finds specified Dataset&#39;s features
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public getDatasetFeaturesWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/${id}/features'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getDatasetFeatures.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
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
//      * Finds MetaData of Dataset by Id
//      * Finds specified Dataset&#39;s MetaData
//      * @param id
//      * @param subjectid Authorization token
//      */
//     public getDatasetMetaWithHttpInfo(id: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/${id}/meta'
//                     .replace('${' + 'id' + '}', String(id));

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         // verify required parameter 'id' is not null or undefined
//         if (id === null || id === undefined) {
//             throw new Error('Required parameter id was null or undefined when calling getDatasetMeta.');
//         }
//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
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
//      * Finds all Datasets
//      * Finds all Datasets in the DB of Jaqpot and returns them in a list. Results can be obtained either in the form of a URI list or as a JSON list as specified by the Accept HTTP header. In the latter case, a list will be returned containing only the IDs of the datasets, their metadata and their ontological classes. The parameter max, which specifies the maximum number of IDs to be listed is limited to 500; if the client specifies a larger value, an HTTP Warning Header will be returned (RFC 2616) with code P670.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listDatasetsWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset';

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
//      * Finds all Datasets
//      * Finds Featured Datasets in the DB of Jaqpot and returns them in a list. Results can be obtained either in the form of a URI list or as a JSON list as specified by the Accept HTTP header. In the latter case, a list will be returned containing only the IDs of the datasets, their metadata and their ontological classes. The parameter max, which specifies the maximum number of IDs to be listed is limited to 500; if the client specifies a larger value, an HTTP Warning Header will be returned (RFC 2616) with code P670.
//      * @param subjectid Authorization token
//      * @param start start
//      * @param max max - the server imposes an upper limit of 500 on this parameter.
//      */
//     public listFeaturedDatasetsWithHttpInfo(subjectid?: string, start?: number, max?: number, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/featured';

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
//      * Merges Datasets
//      * The new intersected Dataset created will be assigned on a random generated Id
//      * @param datasetUris
//      * @param subjectid
//      */
//     public mergeDatasetsWithHttpInfo(datasetUris?: string, subjectid?: string, extraHttpRequestParams?: any): Observable<Response> {
//         const path = this.basePath + '/dataset/merge';

//         let queryParameters = new URLSearchParams();
//         let headers = new Headers(this.defaultHeaders.toJSON()); // https://github.com/angular/angular/issues/6845

//         if (subjectid !== undefined && subjectid !== null) {
//             headers.set('subjectid', String(subjectid));
//         }

//         // to determine the Content-Type header
//         let consumes: string[] = [
//             'application/x-www-form-urlencoded'
//         ];
//         let canConsumeForm = this.canConsumeForm(consumes);
//         let useForm = false;
//         let formParams = new (useForm ? FormData : URLSearchParams as any)() as {
//           set(param: string, value: any): void;
//         };

//         // to determine the Accept header
//         let produces: string[] = [
//             'application/json',
//             'text/uri-list'
//         ];


//         if (datasetUris !== undefined) {
//             formParams.set('dataset_uris', <any>datasetUris);
//         }

//         let requestOptions: RequestOptionsArgs = new RequestOptions({
//             method: RequestMethod.Post,
//             headers: headers,
//             body: formParams.toString(),
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