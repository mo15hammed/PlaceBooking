import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { isProtractorLocator } from 'protractor/built/locators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  private isLoading = true;
  private placesSub: Subscription;
  private loadedPlaces: Place[];
  private relevantPlaces: Place[];
  private loadedListPlaces: Place[];

  constructor(private placesService: PlacesService, private authService: AuthService, private menuCtrl: MenuController) { }

  ngOnInit() {
    
    this.placesSub = this.placesService.places.subscribe( places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.loadedListPlaces = this.relevantPlaces.slice(1);
      
    });

  }

  ionViewWillEnter() {
    this.isLoading = true;
    console.log("fetched");
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
      
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onFilterPlaces(ev: CustomEvent<any>) {
    console.log(ev.detail);
    
    if (ev.detail.value == "bookable") {
      
      this.relevantPlaces = this.loadedPlaces.filter(p => p.userId != this.authService.userId);
      this.loadedListPlaces = this.relevantPlaces.slice(1);  
      
    } else {

      this.relevantPlaces = this.loadedPlaces;
      this.loadedListPlaces = this.relevantPlaces.slice(1);  
    }

  }

}
