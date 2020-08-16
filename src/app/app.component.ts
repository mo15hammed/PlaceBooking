import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { Plugins, Capacitor } from '@capacitor/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  
  private authSub: Subscription;

  private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private navCtrl: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authSub = this.authService.getUserIsAuthenticated().subscribe(auth => {
    console.log("Logged Out !!!!!!");
    console.log(auth, this.previousAuthState);

      if (!auth && this.previousAuthState !== auth ) {
        this.navCtrl.navigateBack('auth')
      }
      this.previousAuthState = auth;
    })
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  onLogout() {
    console.log("Logged Out !!!!!!");
    this.authService.logout();
    this.navCtrl.navigateBack('auth')

  }

}
