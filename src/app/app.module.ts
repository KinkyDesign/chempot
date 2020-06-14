import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar'
import {MatIconModule} from '@angular/material/icon'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatSidenavModule} from '@angular/material/sidenav'
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input'
import {MatExpansionModule} from '@angular/material/expansion'
import {MatTooltipModule} from '@angular/material/tooltip'
import {MatListModule} from '@angular/material/list'
import {MatPaginatorModule} from '@angular/material/paginator'
import {MatSnackBarModule} from '@angular/material/snack-bar'
import {MatBadgeModule} from '@angular/material/badge'
import {MatMenuModule} from '@angular/material/menu'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule, OidcConfigService, OidcSecurityService,LogLevel } from 'angular-auth-oidc-client';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { configf } from './models/config';
import { map, switchMap } from 'rxjs/operators';
import { JsmeComponent } from './jsme/jsme.component';
// import { JsmeComponent } from './jsme/jsme.component';


@NgModule({
  exports:[
  ],
  declarations: [
    AppComponent,
    JsmeComponent,
    // JsmeComponent,
  ],
  imports: [
    MatToolbarModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatListModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    FormsModule,
    MatSidenavModule,
    AuthModule.forRoot()
  ],
  entryComponents:[],
  providers: [OidcConfigService,OidcSecurityService ,
    {
        provide: APP_INITIALIZER,
        useFactory: configureAuth,
        deps: [OidcConfigService, HttpClient],
        multi: true,
    }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  sts_server:string;

    constructor(
      public oidcSecurityService: OidcSecurityService
    ) {

  }
}

export function configureAuth(oidcConfigService: OidcConfigService, httpClient: HttpClient) {
  const setupAction$ = httpClient.get<any>(`/assets/conf.json`).pipe(
      map((customConfig:configf) => {
          return {
              stsServer: customConfig.stsServer,
              redirectUrl: customConfig.redirect_url,
              clientId: customConfig.client_id,
              responseType: customConfig.response_type,
              scope: customConfig.scope,
              postLogoutRedirectUri: customConfig.baseurl,
              // startCheckSession: customConfig.start_checksession,
              // silentRenew: customConfig.silent_renew,
              silentRenewUrl: customConfig.silent_redirect_url,
              // postLoginRoute: customConfig.baseurl,
              // forbiddenRoute: customConfig.baseurl,
              // unauthorizedRoute: customConfig.baseurl,
              logLevel: LogLevel.Error, // LogLevel.Debug,
              maxIdTokenIatOffsetAllowedInSeconds: 60,
              historyCleanupOff: true,
              autoUserinfo: false,
              storage: localStorage
          };
      }),
      switchMap((config) => oidcConfigService.withConfig(config))
  );

  return () => setupAction$.toPromise();
}
