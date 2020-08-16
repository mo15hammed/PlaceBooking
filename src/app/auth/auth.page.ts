import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin: boolean = true;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
  }


  private showAlert(message: string) {
    this.alertCtrl.create({header: 'Authentication Failed !', message: message, buttons: ['Okay']}).then(alertEl => alertEl.present());
  }

  onAuthenticate(form: NgForm) {
    if (form) {
      if (!form.valid) {
        return;
      }
      const email = form.value.email;
      const password = form.value.password;
      console.log(email, password);


      this.loadingCtrl.create({keyboardClose: true, message: 'Logging in', spinner: 'dots'}).then(loadingEl => {
        loadingEl.present();
        
        let authObs : Observable<any>;

        if (this.isLogin) {
          console.log("logging in...");
          authObs = this.authService.login(email, password);
          
        } else {
          console.log("signing up...");
          authObs = this.authService.signup(email, password);
          
        }

        authObs.subscribe(res => {
          console.log("AUTH : ", res)
          this.router.navigateByUrl('places')

          loadingEl.dismiss();
        }, errRes => {
          console.log(errRes); 
          const errCode = errRes.error.error.message;
          let errMessage = 'Could not authenticate! Please try again.'
          if (errCode === 'EMAIL_EXISTS') {
            errMessage = 'This email address already exists !';
          } else if (errCode === 'EMAIL_NOT_FOUND') {
            errMessage = 'This email address could not be found !';
          } else if (errCode === 'INVALID_PASSWORD') {
            errMessage = 'This password is incorrect !';
          }
          this.showAlert(errMessage);
          loadingEl.dismiss();
        });

      });
    }
  }

  switchAuth() {
    this.isLogin = !this.isLogin;
  }

}
