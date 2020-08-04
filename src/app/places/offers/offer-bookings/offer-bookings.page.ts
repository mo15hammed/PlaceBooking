import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {

  private place: Place;

  constructor(
    private placesService: PlacesService,
    private actRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.actRoute.paramMap.subscribe(paramMap => {
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    })
  }

}
