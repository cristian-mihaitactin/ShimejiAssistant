import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterFormComponent } from '../register-form/register-form.component';
const electron = (<any>window).require('electron');

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})

export class LoginFormComponent implements OnInit {
    // loginForm = new FormGroup({
    //   username: new FormControl(''),
    //   password: new FormControl(''),
    // });

    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    error!: string;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        private cdr: ChangeDetectorRef
       // private route: ActivatedRoute,
        //private router: Router,
        //private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        // if (this.authenticationService.currentUserValue) { 
        //     this.router.navigate(['/']);
        // }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            console.log("this.loginForm.invalid")
            console.log(this.loginForm.invalid)
            return;
        }

        this.loading = true;
    // electron.ipcRenderer.on('bucky-profile', (_event: any, arg: BuckyProfileModel) => {

        electron.ipcRenderer.on('login-reply', (_event: any, arg: {
          result: string, 
          isError: boolean,
          error: Error
        }) => {
          if (arg.isError){
            console.log('login-repy error')
            console.log(arg);
            this.error = arg.error.message;
            console.error(this.error);
          } else {
            console.log('Login successful');
            console.log(arg);
            this.activeModal.dismiss('Logged In - closing modal')
          }
          this.loading = false;
          this.cdr.detectChanges();
        });

        electron.ipcRenderer.send('login-request', 
          this.loginForm.value
        );
    }

    registrationLinkClicked(){
      const modalRegisterRef = this.modalService.open(RegisterFormComponent);
      this.activeModal.close();
      
    }
}