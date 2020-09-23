import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Credentials } from '../ui-models/credentials';
import { ErrorDialogComponent } from './error-dialog/error-dialog.component';
import { ErrorReport } from '../ui-models/errorReport';
import { Organization } from '../jaqpot-client/model/organization';
import { OrganizationService } from '../jaqpot-client/api/organization.service';
import { UserService } from '../jaqpot-client/api/user.service';
// import { NotificationFactoryService } from '../jaqpot-client/factories/notification-factory.service';
import { NotificationService } from '../jaqpot-client/api/notification.service';
import { Notification } from '../jaqpot-client/model/notification';
// import { User } from '../jaqpot-client';
import { User } from '../jaqpot-client/model/user';
// import { FeatureFactoryService } from '../jaqpot-client/factories/feature-factory.service';
import { DatasetToViewdataService } from '../services/dataset-to-viewdata.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DatasetService } from '../jaqpot-client/api/dataset.service';
import { ModelApiService } from '../jaqpot-client/api/model.service';

@Injectable()
export class DialogsService {

    private _errorReport:ErrorReport;

    constructor(private dialog: MatDialog,
        // public notificationFactory:NotificationFactoryService,
        // public notificationService:NotificationService
        ){}

    public close(){
        this.dialog.closeAll();
    }



    public onError(error:HttpErrorResponse){
        let errorReport = error.error
        let dialogRef: MatDialogRef<ErrorDialogComponent>;
        dialogRef = this.dialog.open(ErrorDialogComponent);
        // if (error.error instanceof ErrorEvent) {
        //     // A client-side or network error occurred. Handle it accordingly.
        //     console.error('An error occurred:', error.error.message);
        //   } else {
        //     // The backend returned an unsuccessful response code.
        //     // The response body may contain clues as to what went wrong,
        //     console.error(
        //       `Backend returned code ${error.status}, ` +
        //       `body was: ${error.error}`);
        //   }
        dialogRef.componentInstance.httpStatus = errorReport.httpStatus;
        dialogRef.componentInstance.details = errorReport.details;
        dialogRef.componentInstance.message = errorReport.message;
        return dialogRef.afterClosed();
    }

}