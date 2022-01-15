import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginFormComponent } from '../login-form/login-form.component'

@Component({
  selector: 'app-sideview',
  templateUrl: './sideview.component.html',
  styleUrls: ['./sideview.component.css']
})
export class SideviewComponent implements OnInit {

  constructor(private modalService: NgbModal) {}

  ngOnInit() {
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginFormComponent);
    modalRef.componentInstance.name = 'World';
  }

}
