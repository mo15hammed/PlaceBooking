import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { Subscription } from 'rxjs';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {

  private placesSub: Subscription;
  private loadedPlaces: Place[];
  private loadedListPlaces: Place[];

  constructor(private placesService: PlacesService, private menuCtrl: MenuController) { }

  ngOnInit() {
    
    this.placesSub = this.placesService.places.subscribe( places => {
      this.loadedPlaces = places;
      this.loadedListPlaces = this.loadedPlaces.slice(1);  
    });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onFilterPlaces(ev: CustomEvent<any>) {
    console.log(ev.detail);
    
  }

}
