import { Injectable } from '@angular/core';
import { Chempot, IJaqpotClient, JaqpotClientFactory, Prediction } from '@euclia/jaqpot-client';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { of } from 'rxjs';
import { Config } from 'src/app/config/config';


interface IJaqpotIntegration{
  predictChempot(chempot:Chempot):Promise<Prediction>
}


@Injectable({
  providedIn: 'root'
})
export class JaqpotService implements IJaqpotIntegration {

  private _jaqpotClient:IJaqpotClient

  constructor(
    public oidcSecurityService: OidcSecurityService
  ) {
    this._jaqpotClient = new JaqpotClientFactory(Config.JaqpotBase).getClient();
  }

  public predictChempot(chempot:Chempot):Promise<Prediction>{
    // this._jaqpotClient.getOrgsTagModels()
    let token = this.oidcSecurityService.getToken();
    return this._jaqpotClient.chempot(chempot, token);
  }

}
