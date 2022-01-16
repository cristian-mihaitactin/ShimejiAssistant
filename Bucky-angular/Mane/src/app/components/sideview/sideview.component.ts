import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';
import { LoginFormComponent } from '../login-form/login-form.component'
import { RegisterFormComponent } from '../register-form/register-form.component';
const electron = (<any>window).require('electron');

@Component({
  selector: 'app-sideview',
  templateUrl: './sideview.component.html',
  styleUrls: ['./sideview.component.css']
})
export class SideviewComponent implements OnInit {
  modalLoginRef!:NgbModalRef;
  modalRegisterRef!:NgbModalRef;

  loggedIn = false;

  userName!:string;

  constructor(
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef
    ) {}

  ngOnInit() {
    electron.ipcRenderer.on('logged-in', (_event: any, arg:boolean) => {
      console.log('logged-in:' + arg)  
      this.cdr.detectChanges();
    });

    electron.ipcRenderer.on('user-info-reply', (_event: any, arg: any) => {
      console.log('user-info-reply:',arg);
      this.userName = arg.username; 
      this.cdr.detectChanges();
    });

    electron.ipcRenderer.send('is-logged-in', ''); 
    electron.ipcRenderer.send('user-info-request', '');

  }

  openLoginModal() {
    this.modalLoginRef = this.modalService.open(LoginFormComponent);
  }

  logout() {
    electron.ipcRenderer.send('logout-request',
          'Logout'
        );
        // this.authenticationService.logout();
        // this.router.navigate(['/login']);
    }

}
