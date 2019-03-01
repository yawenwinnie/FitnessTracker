import { Subject} from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class UIService{

    loadingStateChange = new Subject<boolean>();

    constructor( private snackBar: MatSnackBar){}

    showBar(message, action, duration){
        this.snackBar.open(message, action, {
            duration: duration
        });
    }
}