import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, NgForm, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../models/User.model';
import { first } from 'rxjs/operators'
import { GlobalService } from '../services/global.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  namePattern = "[a-zA-Z ]*";
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  
  @Input() errorMessage!: string;

  userForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    firstName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  authStatus: boolean = false;

  constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private globalService: GlobalService) {}

  ngOnInit(): void {
    this.authStatus = this.authService.isAuth;
    this.initForm();
  }

  
  initForm() {
    this.userForm = this.formBuilder.group({
      name: ['', [Validators.maxLength(25), Validators.minLength(3), Validators.required, Validators.pattern(this.namePattern)]],
      firstName: ['', [Validators.maxLength(25), Validators.minLength(3), Validators.required, Validators.pattern(this.namePattern)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      password: ['', [Validators.maxLength(15), Validators.minLength(8), Validators.required]]
    });
  }

  get name() { return this.userForm.get('name'); }
  get firstName() { return this.userForm.get('firstName'); }
  get email() { return this.userForm.get('email'); }
  get password() { return this.userForm.get('password'); }


  onSignin() {
    const formValue = this.userForm.value;
    const newUser = new User(
      formValue['name'],
      formValue['firstName'],
      formValue['email'],
      formValue['password']
    );
    this.authService.signin(newUser).pipe(first()).subscribe(
      (response: any) => {
        this.authService.login(newUser.email, newUser.password)
        .subscribe(
          (response: any) => {
            if (response.token) {
              localStorage.setItem('token', response.token);
              this.globalService.isAdmin = response.userIsAdmin;
              this.globalService.isUser = response.user;
              this.authStatus = this.authService.isAuth;
              this.router.navigate(['home']);
            } else {
              this.router.navigate(['']);
            }
          },
          (error) => {
            console.log(error.error.error)
            this.errorMessage = error.error.error
          }
        );
      },
      (error) => this.errorMessage = error.error.error
    );
  }

}


