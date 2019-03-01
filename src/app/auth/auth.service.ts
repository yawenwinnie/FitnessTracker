import { Injectable } from '@angular/core'
import { Subject } from "rxjs/Subject";
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';


import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import * as fromApp from '../app.reducer';

@Injectable()export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(private router: Router,
        private afauth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<{ui: fromApp.State}>
    ) { }

    initAuthListener() {
        this.afauth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            }else{
                this.trainingService.cancelSubscriptions();
                this.isAuthenticated = false;
                this.authChange.next(false);
                this.router.navigate(['/login']);
            }
        });
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChange.next(true);
        this.store.dispatch({type: 'START_LOADING'});
        this.afauth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => { 
                //this.uiService.loadingStateChange.next(false);
                this.store.dispatch({type: 'STOP_LOADING'});
            })
            .catch(error => {
                 //this.uiService.loadingStateChange.next(false);
                this.store.dispatch({type: 'STOP_LOADING'});
                this.uiService.showBar(error.message, null, 3000);
            });
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChange.next(true);
        this.store.dispatch({type: 'START_LOADING'});
        this.afauth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.store.dispatch({type: 'STOP_LOADING'});
                this.uiService.loadingStateChange.next(false);
            })
            .catch(error => {
                //this.uiService.loadingStateChange.next(false);
                this.store.dispatch({type: 'STOP_LOADING'});
                this.uiService.showBar(error.message, null, 3000);
            });
    }

    logout() {
        this.afauth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}