import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class UserService {

    usersSubject = new Subject<any[]>();
    
    public errorMessage!: string;
    private users: any[] = [];


    constructor(private http: HttpClient, private router: Router) {}

    emitUsersSubject() {
      this.usersSubject.next(this.users.slice());
    }

    getAllProfile() {
      this.http.get<any[]>('http://localhost:3000/api/profile')
      .subscribe(
        (response) => {
          this.users = response;
          this.emitUsersSubject();
        },
        (error) => {this.errorMessage = error.message;}
      );  
    }

    getOneProfile(id: string) {
      return this.http.get<Object>('http://localhost:3000/api/profile/' + id)
    }

    deleteProfile() {
      this.http.delete('http://localhost:3000/api/profile')
      .subscribe(
        (response) => {
          this.router.navigate(['']);
          localStorage.removeItem('token');
        },
        (error) => {this.errorMessage = error.message;}
      );
    }

    deleteOneProfile(id: string) {
      return this.http.delete('http://localhost:3000/api/profile/' + id)
    }
    
}