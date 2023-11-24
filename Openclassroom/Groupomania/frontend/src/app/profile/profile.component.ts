import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { GlobalService } from '../services/global.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input() userName!: string;
  @Input() userFirstName!: string;
  @Input() clickedBouton: boolean = false;
  @Input() adminClickedBouton: boolean = false;
  @Input() userSearchedName!: string;
  @Input() userSearchedFirstName!: string;
  @Input() errorMessage!: string;
  @Input() userSearchedIsAdmin!: number;

  searchForm: FormGroup = new FormGroup({
    searchUser: new FormControl(''),
  });

  public readonly users$: Observable<any[]>;
  
  user!: any;
  isAdmin!: number;
  userSearched!: any;
  
  

  constructor(private userService: UserService, private globalService: GlobalService, private formBuilder: FormBuilder) {
    this.userService.getAllProfile();
    this.users$ = this.userService.usersSubject;
  }

  ngOnInit(): void {
    this.onGetProfile();
    this.initForm();
    this.isAdmin = this.globalService.isAdmin;
  }

  initForm() {
    this.searchForm = this.formBuilder.group({
      searchUser: ['', [Validators.required]]
    })
  }

  onGetProfile() {
    const id = this.globalService.isUser;
    this.userService.getOneProfile(id).subscribe(
      (response: Object) =>{
        this.user = response;
        this.userName = this.user.name;
        this.userFirstName = this.user.first_name;
      },
      (error) => {
        this.errorMessage = error.error.error;
      }  
    );
  }

  deleteClick() {
    this.clickedBouton = true;
  }

  adminDeleteClick() {
    this.adminClickedBouton = true;
  }

  giveUpDelete() {
    this.clickedBouton = false;
  }

  adminGiveUpDelete() {
    this.adminClickedBouton = false;
  }

  onDeleteProfile() {
    this.userService.deleteProfile();
  }

  onGetOneProfile() {
    const formValue = this.searchForm.value;
    const id = formValue['searchUser'];
    this.userService.getOneProfile(id).subscribe(
      (response: Object) =>{
        this.userSearched = response;
        this.userSearchedIsAdmin = this.userSearched.is_admin;
        this.userSearchedName = this.userSearched.name;
        this.userSearchedFirstName = this.userSearched.first_name;
        this.errorMessage = '';
      },
      (error) => this.errorMessage = error.error.error
    );
  }
  
  onDeleteOneProfile() {
    const formValue = this.searchForm.value;
    const id = formValue['searchUser'];
    this.userService.deleteOneProfile(id).subscribe(
      (response: any) => {
        this.searchForm.reset();
        this.userSearched = null;
        this.adminGiveUpDelete();   
      },
      (error) => this.errorMessage = error
    );
  }

}
