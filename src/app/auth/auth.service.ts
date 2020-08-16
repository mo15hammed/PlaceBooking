import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Storage } from '@capacitor/core';

interface AuthenticationResponse {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) {}
  
  private _user = new BehaviorSubject<User>(null);

  getUserIsAuthenticated() {

    return this._user.asObservable().pipe(
      map(user => {
        
        return user ? !!user.token : false;
      })
    )

  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        return user ? user.id : null;
      })
    );
  }

  signup(email: string, password: string) {
    return this.http.post<AuthenticationResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.FIREBASE_API_KEY}`,
      {email: email, password: password, returnSecureToken: true}
      ).pipe(tap(resData => {
        this.setUserData(resData);
      }))
  }


  autoLogin() {
    return from(Storage.get({key: 'CURRENT_USER'})).pipe(
      map(currentUserData => {
        console.log('AUTO LOGIN');
        
        if (!currentUserData || !currentUserData.value) {
          console.log('AUTO LOGIN FAIL');
          return null;
        }

        const currentUser = JSON.parse(currentUserData.value) as User

        if ( !!currentUser.token ) {
          console.log("TOKEN EXPIRED !!!!");
          return null ;
        }

        return currentUser;
      }),
      tap(currentUser => {
        
        this._user.next(currentUser);
      }),
      map (currentUser => {
        return !!currentUser;
      })
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthenticationResponse>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.FIREBASE_API_KEY}`,
      {email: email, password: password, returnSecureToken: true}
      ).pipe(tap( resData => {
        this.setUserData(resData);
      }))

  }

  logout() {
    this._user.next(null);
    Storage.remove({key: 'CURRENT_USER'});
  }


  setUserData(resData: AuthenticationResponse) {

    const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
    const user = new User (resData.localId, resData.email, resData.idToken, expirationDate)
    this._user.next(user);
    
    this.storeAuthData(user);

  }

  storeAuthData(user: User) {
    
    Storage.set({
      key: 'CURRENT_USER',
      value: JSON.stringify(user)
    })
  }
}
