import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isAdmin!: number;
  constructor(private authService: AuthService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.isAdmin = this.globalService.isAdmin;
  }

  onClickLogout() {
    this.authService.logout()
  }
}
