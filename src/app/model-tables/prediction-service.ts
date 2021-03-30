import { Inject, Injectable, Optional } from '@angular/core';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Chempot } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { JaqpotClient } from '@euclia/jaqpot-client';
import { Prediction } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
// import { Config } from '../config/config'
// import { Config } from 'smilesextractor/node_modules/protractor/built';


@Injectable({
    providedIn: 'root',})

export class PredictionService {
    // https://stackoverflow.com/questions/50011443/tslint-how-to-disable-error-somevariable-is-declared-but-its-value-is-never-rea
    _chempot: Chempot = {};
    // jaqpotClient= <JaqpotClient>{};
    // jaqpotClient = new JaqpotClient(null, null, null, null, null, null, null, null, null);
    private jaqpotClient: JaqpotClient;

    constructor(
        public oidcSecurityService: OidcSecurityService,
        ){
        }

    

    public predict_selected(_chempot:Chempot):Promise<void | Prediction>{
        const token = this.oidcSecurityService.getToken();
        return this.jaqpotClient.chempot(this._chempot, token).then((res:Prediction)=>{
            res.data;
            res.predictions;
            })
    }



}