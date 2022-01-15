import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';
import { LoginFormComponent } from '../login-form/login-form.component'
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-sideview',
  templateUrl: './sideview.component.html',
  styleUrls: ['./sideview.component.css']
})
export class SideviewComponent implements OnInit {
  modalLoginRef!:NgbModalRef;
  modalRegisterRef!:NgbModalRef;

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
  }

  openLoginModal() {
    this.modalLoginRef = this.modalService.open(LoginFormComponent);
  }

  openRegisterModal() {
    if(this.modalLoginRef?.shown) {
      this.modalLoginRef.close('Changed to register');
    }
    this.modalRegisterRef = this.modalService.open(RegisterFormComponent);
  }
  /*
  logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }
  */

}
