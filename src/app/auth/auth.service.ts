import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}
  private _userIsauthenticated: boolean = false;

  getUserIsAuthenticated() {
    return this._userIsauthenticated;
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
