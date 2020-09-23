import { Injectable } from "@angular/core";
import { BaseClient } from "./base.client";
import { Discussion } from "../model/discussion";
// import { SessionService } from "../../session/session.service";
import { DialogsService } from "../../dialogs/dialogs.service";
import { OidcSecurityService } from "angular-auth-oidc-client";
import { Config } from "../../config/config";
import { HttpClient } from "@angular/common/http";


@Injectable()
export class DiscussionService extends BaseClient<Discussion>{

    private _privateBasePath : string;

    private discussion:Discussion;
    private _discussionBase : string;
    // private _getUsers : string;
    // private _getUserID : string;
    // private _getUserIdQuota : string;


    constructor(public http: HttpClient,
        // public sessionServise:SessionService,
        public dialogsService:DialogsService,
        public oidcSecurityService: OidcSecurityService){
            super(http, dialogsService, oidcSecurityService, "/discussion/")
            this._privateBasePath = Config.JaqpotBase;
            this._discussionBase = this._privateBasePath + "/user/"
        }

}