import { Injectable} from '@angular/core';
import '../rxjs-operators';

import { ErrorReport } from '../model/errorReport';
import { Task } from '../model/task';

import { Config } from '../../config/config';
// import { SessionService } from '../../session/session.service';
import { DialogsService } from '../../dialogs/dialogs.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { User } from '../model/user';
import { BaseClient } from './base.client';
import { Organization } from '../model/organization';
import { Feature } from '../model/models';

@Injectable()
export class FeatureApiService extends BaseClient<Feature>{
    
    _privateBasePath:string;
    private feature:Feature;
    _featureBase:string = "/feature/"

    constructor(http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/feature/")
        }

    
    // public updateOrganizationById(id:string, user:User): Observable<User> {
    //     let params = new URLSearchParams();
            
    //     let headers = new Headers({'Content-Type':'application/json'});
    //     const token = this.oidcSecurityService.getToken();
    //     const tokenValue = 'Bearer ' + token;
    //     headers.set('Authorization', tokenValue);
    
    //     return this.http.put(this._userBase + id, user ,{ headers: headers, search: params }).pipe(
    //         map((res : Response) => {  
    //             return res.json()            
    //         }),catchError( err => this.dialogsService.onError(err) ));
    // }

}