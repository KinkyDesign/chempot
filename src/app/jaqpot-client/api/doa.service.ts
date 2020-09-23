import {  Injectable } from '@angular/core';
import '../rxjs-operators';
// import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BaseClient } from './base.client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Doa } from '../model/doa';
import { Config } from '../../config/config';
import { tap, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class DoaApiService extends BaseClient<Doa>{

    _privateBasePath:string;
    _doaBase:string = "/doa/"

    constructor(http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/doa/")
        }

    
    public getDoa(hasSources:string): Observable<Doa>{
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._doaBase
        let params = new HttpParams().set('hasSources', hasSources);
        return this.http.get(pathFormed, { headers: headers, params: params} ).pipe(
            tap((res : Response) => { 
                return res            
            }),catchError( err => this.dialogsService.onError(err) )
        );

    }

    public checkIfDoaExists(hasSources:string){
        const token = this.oidcSecurityService.getToken();
        const tokenValue = 'Bearer ' + token;
        let headers = new HttpHeaders().set('Content-Type','application/json').set('Authorization', tokenValue);
        let pathFormed = Config.JaqpotBase + this._doaBase
        let params = new HttpParams().set('hasSources', hasSources);
        return this.http.get<Response>(pathFormed, { headers: headers, params: params} )
    }


}