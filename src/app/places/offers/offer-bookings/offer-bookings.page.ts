import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

  private isLoading: boolean;
  private placeSub: Subscription;
  private offer: Place;

  constructor(
    private placesService: PlacesService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log('-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-');
    this.isLoading = true;
    this.actRoute.paramMap.subscribe(paramMap => {
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(offer => {
        
        this.isLoading = false;
        this.offer = offer;
      });
    })
  }


  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
