import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  private isLoading: boolean = false;
  private isLogin: boolean = true;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
  }

  onLogin() {

    this.isLoading = true;
    
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in', spinner: 'dots'}).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        loadingEl.dismiss();
        this.isLoading = false;
        this.authService.login();
      }, 1500);

    });
  }

  onSubmit(form: NgForm) {
    // console.log(form);
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    
    if (this.isLogin) {
      // TODO: Login
      console.log("logging in...");
      
    } else {
      // TODO: Signup
      console.log("signing up...");
      
    }

  }

  switchAuth() {
    this.isLogin = !this.isLogin;
  }

}
