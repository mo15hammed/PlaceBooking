import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  private loadedPlaces: Place[];

  constructor(
    private placesService: PlacesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.getPlaces();
  }

  onEdit(placeId : string, ionItemSliding: IonItemSliding) {
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', placeId]);
    ionItemSliding.close();
    console.log('place (', placeId, ') editted');
    
  }

}
