import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { Model } from '../jaqpot-client/model/models';


@Injectable(
    // https://stackoverflow.com/questions/43374331/angular-2-observable-subscription-not-triggering
    // https://stackoverflow.com/questions/50848357/what-is-the-purpose-of-providedin-with-the-injectable-decorator-when-generating
    // If I dont put {providedIn: 'root} inside Injectabe decorator of the service, but instead I use the providers array declaration
    // inside every component of interest, then there is danger of each component having each own separate INSTANCE of the service 
    // , which is bad, because the BehaviorSubject will not work, due to this fact.
    {providedIn: 'root'}
)
export class SelectedModelsStateService {

    private selectedModelsSource = new BehaviorSubject <Model[] | null> (null); 

    // selectedModelsChange$ is the observable
    selectedModelsChange$ = this.selectedModelsSource.asObservable();

 constructor(){}
    
    // changeSelectedModels is the observer
    changeSelectedModels(selected_models: Model[] | null): void{

    this.selectedModelsSource.next(selected_models);


    }

}