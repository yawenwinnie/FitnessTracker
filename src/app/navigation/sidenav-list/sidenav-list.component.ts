import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy{
  @Output() sidenavClose = new EventEmitter();
  isAuth = false;
  authRef: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authRef = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });
  }

  onClose(){
    this.sidenavClose.emit();
  }

  onLogout(){
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy(){
    this.authRef.unsubscribe();
  }

}
