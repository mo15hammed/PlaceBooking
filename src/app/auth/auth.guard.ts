import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { AuthService } from './auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    this.authService.autoLogin().pipe(
      take(1),

    )

    return this.authService.getUserIsAuthenticated().pipe(take(1), switchMap(auth => {
      if (!auth) {        
        return this.authService.autoLogin();
      } else {
        return of(auth)
      }
      
    }), tap (auth => {
      if (!auth) {
        this.router.navigateByUrl("/auth");
      }
    }));
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     
  //   if (!this.authService.getUserIsAuthenticated())
  //     this.router.navigateByUrl("/auth");

  //   return this.authService.getUserIsAuthenticated();
  // }

}
