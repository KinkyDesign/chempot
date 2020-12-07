import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { Model } from '../jaqpot-client/model/models';


@Injectable(
    {providedIn: 'root'}
)
export class SmilesStateService {

    private smileSource = new BehaviorSubject <string | null> (null); 

    // smileChange$ is the observable
    smilesChange$ = this.smileSource.asObservable();

 constructor(){}
    
    // changeSmile is the observer
    changeSmile(smile: string | null): void{

    this.smileSource.next(smile);


    }

}