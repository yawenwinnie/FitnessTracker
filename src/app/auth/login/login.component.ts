import { Component, OnInit} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Store} from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isloading$: Observable<boolean>;
  private loadingSubs: Subscription;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store<{ui: fromApp.State}>
    ) {}

  ngOnInit() {
    this.isloading$ = this.store.map(state => state.ui.isLoading);

    // this.loadingSubs = this.uiService.loadingStateChange.subscribe(isLoading => {
    //   this.isloading = isLoading;
    // });

    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', { validators: [Validators.required] })
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    });
  }

  // ngOnDestroy(){
  //   if(this.loadingSubs){
  //   this.loadingSubs.unsubscribe();
  // }
}
