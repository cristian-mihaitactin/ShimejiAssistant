import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs';
import { LoginFormComponent } from '../login-form/login-form.component'
import { RegisterFormComponent } from '../register-form/register-form.component';
import * as $ from 'jquery';
import { createImportSpecifier } from 'typescript';
import { data } from 'jquery';

const electron = (<any>window).require('electron');


@Component({
  selector: 'app-sideview',
  templateUrl: './sideview.component.html',
  styleUrls: ['./sideview.component.css']
})


export class SideviewComponent implements OnInit {

  @Output() 
  selectedAreaEvent = new EventEmitter<string>();

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
      this.loggedIn = arg;
      electron.ipcRenderer.send('user-info-request', '');

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

  itemClicked(event: Event) {
    event.preventDefault();
    
    $(".list-group .list-group-item").removeClass("active");
    (event.target as Element).classList.add("active");

    var dataToggled = (event.target as Element).attributes.getNamedItem('data-toggle');
    if (dataToggled !== undefined && dataToggled !== null) {
      this.selectedAreaEvent.emit(dataToggled.value);
    }
  }

  openLoginModal() {
    this.modalLoginRef = this.modalService.open(LoginFormComponent);
  }

  logout() {
    electron.ipcRenderer.send('logout-request',
          'Logout'
        );
    }

}
