import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  private isLoading: boolean = false;

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
    // this.authService.login();

  }

}
