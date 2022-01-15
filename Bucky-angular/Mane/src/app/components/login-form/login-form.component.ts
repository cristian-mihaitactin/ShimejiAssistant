import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
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
        private formBuilder: FormBuilder,
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

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
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
            console.error(this.error);
            this.error = arg.result;
          } else {
            console.log('Login successful');
          }
          this.loading = false;

        });

        electron.ipcRenderer.send('login-request', {
          //username: this.username.value,
          //password: this.password.value
        });
    }
}