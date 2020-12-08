import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';


@Injectable(
    {providedIn: 'root'}
)
export class SmilesStateService {

    private smileSource = new BehaviorSubject <string | null> (null); 

    // smileChange$ is the observable
    smilesChange$ = this.smileSource.asObservable();

 constructor(){}
    
    // changeSmile is the observer
    changeSmile(selected_smile: string | null): void{

    this.smileSource.next(selected_smile);


    }

}