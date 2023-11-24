import { User } from "../models/User.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { GlobalService } from "./global.service";


@Injectable()

export class AuthService {

    constructor(private http: HttpClient, private router: Router, private globalService: GlobalService) {}

    isAuth = false;

    login(email: string, password: string) {
        this.isAuth = true;
        return this.http.post(
            'http://localhost:3000/api/auth/login',
            { email: email, password: password })
        ;
        
    }

    signin(user: User) {
        return this.http.post(
            'http://localhost:3000/api/auth/signin',
            { user: user })
        ;    
    }

    logout() {
        this.globalService.isAdmin = 0;
        localStorage.removeItem('token');
        this.router.navigate(['']);
    }
}