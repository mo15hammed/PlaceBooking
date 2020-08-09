import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  private placesSub: Subscription;
  private loadedPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    private router: Router
  ) { }


  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
    })
  }
  
  ngOnDestroy() {
    if(this.placesSub) {
      this.placesSub.unsubscribe;
    }
  }

  onEdit(placeId : string, ionItemSliding: IonItemSliding) {
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', placeId]);
    ionItemSliding.close();
    console.log('place (', placeId, ') editted');
    
  }

}
