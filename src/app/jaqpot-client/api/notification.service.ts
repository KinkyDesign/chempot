import { Inject, Injectable, Optional } from '@angular/core';
import { map, filter, catchError, mergeMap, tap } from 'rxjs/operators';
import { Observable , of, throwError} from 'rxjs';
import '../rxjs-operators';

import { Algorithm } from '../model/algorithm';
import { ErrorReport } from '../model/errorReport';
import { Task } from '../model/task';

// import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Config } from '../../config/config';
// import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { User } from '../model/user';
import { BaseClient } from './base.client';
import { Organization } from '../model/organization';
import { Notification } from '../model/notification';


@Injectable()
export class NotificationService extends BaseClient<Notification>{
    
    _privateBasePath:string;
    private orgnanization:Organization;
    _notificationBase:string = "/notification/"

    constructor(http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/notification/")
            this._privateBasePath = Config.JaqpotBase + this._notificationBase
        }

    public getUnreadNotifications():Observable<any>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("query", "UNREAD");
        let pathFormed = this._privateBasePath
             
        return this.http.get(pathFormed, { headers: headers, params: params } ).pipe(
            tap((res : Response) => { 
                return res         
            }),catchError( err => this.handleErrorIn(err) ) 
            
        );
    }

    public getUnreadNotificationsResponse(){
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("query", "UNREAD");
        let pathFormed = this._privateBasePath
        return this.http.get<Response>(pathFormed, { headers: headers, params: params} ); 
    }

    public getNotifsByCategory(category:string, start:number, max:number):Observable<any>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("category", category).set('start', start.toString()).set('max', max.toString());
        let pathFormed = this._privateBasePath
        return this.http.get(pathFormed, { headers: headers, params: params} ); 
    }
     
    public countNotifsByCategory(category:string, start:number, max:number):Observable<any>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("category", category).set('start', start.toString()).set('max', max.toString());
        let pathFormed = this._privateBasePath
        return this.http.get(pathFormed, { headers: headers, params: params, observe:'response' } ).pipe(
            tap(resp => { 
                return resp.headers.get('total');   
            }),catchError( err => this.handleErrorIn(err) ) 
            
        );
    }



    public countUnreadNotifications():Observable<any>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let params = new HttpParams().set("query", "UNREAD").set("min", "0").set("max", "1");
        let pathFormed = this._privateBasePath
        return this.http.get(pathFormed, { headers: headers, params: params, observe:'response' } ).pipe(
            tap(resp => { 
                return resp.headers.get('total');   
            }),catchError( err => this.handleErrorIn(err) ) 
            
        );
    }



    handleErrorIn(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            'Something bad happened; please try again later.');
        };

}