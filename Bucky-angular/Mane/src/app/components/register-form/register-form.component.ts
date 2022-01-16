import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginFormComponent } from '../login-form/login-form.component';
const electron = (<any>window).require('electron');

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

    registerForm!: FormGroup;
    loading = false;
    submitted = false;
    error!: string;

    constructor(
        public activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private formBuilder: FormBuilder,
        //private router: Router,
        //private authenticationService: AuthenticationService,
        //private userService: UserService
    ) {
        // redirect to home if already logged in
        /*
        if (this.authenticationService.currentUserValue) {
            this.router.navigate(['/']);
        }
        */
    }
    
    

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            username: ['', Validators.required],
            emailForm: ['', Validators.required, Validators.email],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        }, { validators: this.checkPasswords });
    }

    checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
      let pass = group.get('password')!.value;
      let confirmPass = group.get('confirmPassword')!.value;

      return pass === confirmPass ? null : { notSame: true };
    }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        electron.ipcRenderer.on('register-reply', (_event: any, arg: {
          firstName: string, 
          lastName: string, 
          username: string, 
          password: string, 
          email: string, 
          isError: boolean,
          error: Error
        }) => {
          if (arg.isError){
            this.error = arg.error.message;
            console.error(this.error);
          } else {
            console.log('Register successful');
          }
          this.loading = false;

        });

        this.loading = true;

        electron.ipcRenderer.send('register-request',
          this.registerForm.value
        );
    }
    loginLinkClicked(){
      const modalLoginRef = this.modalService.open(LoginFormComponent);
      this.activeModal.close();
    }
}
