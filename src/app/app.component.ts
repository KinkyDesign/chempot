import { Component, OnInit } from '@angular/core';
import { OidcSecurityService, PublicConfiguration, OidcClientNotification } from 'angular-auth-oidc-client';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  isDarkTheme: boolean;
  loggedIn:boolean;
  subscription:Subscription;
  isAuthorizedSubscription: Subscription;
  isAuthorized: boolean;

  configuration: PublicConfiguration;
  userDataChanged$: Observable<OidcClientNotification<any>>;
  userData$: Observable<any>;
  isAuthenticated: Observable<boolean>;
  checkSessionChanged$: Observable<boolean>;
  checkSessionChanged: any;

  sideOpened=false;
// pageHeader: string = 'Smiles Extractor';

constructor(
  public oidcSecurityService: OidcSecurityService,
  private _router:Router
){}

ngOnInit(){
  this.isAuthorizedSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
    (isAuthorized: boolean) => {
      if(isAuthorized === true){
        this.isAuthorized = true
        this.loggedIn = true;
        // this.userData$.subscribe(d =>{
        //   if(d){
        //     this.sessionService.setUserData(d)
        //   }
        //   // console.log(d)
        //     // this.sessionService.setUserData(d)
        //   }
          
        //   )
      }else{
        this.isAuthorized = false
        this.loggedIn = false;
      }
    });
    this.configuration = this.oidcSecurityService.configuration;
    this.userData$ = this.oidcSecurityService.userData$;
    this.isAuthenticated = this.oidcSecurityService.isAuthenticated$;
    this.checkSessionChanged$ = this.oidcSecurityService.checkSessionChanged$;

    this.oidcSecurityService.checkAuth().subscribe((isAuthenticated) => console.log('app authenticated', isAuthenticated));


  }

  login() {
    this.oidcSecurityService.authorize();
  }

  menuButton(){
    if(this.sideOpened === true){
      this.sideOpened = false
    }else{
      this.sideOpened = true
    }
  }

  logout() {
    this.oidcSecurityService.logoff()
    this._router.navigate(['/'])
    // console.log("loged aout")
    // this.oidcSecurityService.logoff();
  }

  goToHome(){
    this._router.navigate(['/'])
  }

}


