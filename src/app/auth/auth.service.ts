import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}
  private _userIsauthenticated: boolean = true;
  private _userId: string= 'abc';

  getUserIsAuthenticated() {
    return this._userIsauthenticated;
  }

  get userId() {
    return this._userId;
  }

  login() {
    this._userIsauthenticated = true;
    this.router.navigateByUrl("/places");
  }

  logout() {
    this._userIsauthenticated = false;
    this.router.navigateByUrl("/auth");
  }
}
