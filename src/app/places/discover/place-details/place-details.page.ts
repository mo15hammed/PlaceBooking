import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { PlacesService } from '../../places.service';
import { Place } from '../../places.model';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit {

  private place: Place;

  constructor(
    private placesService: PlacesService,
    private actRoute: ActivatedRoute,
    private router: Router,
    private navCtrl: NavController,
    private modalCtrl: ModalController
    ) { }

  ngOnInit() {
    console.log('Place Details page initiated !!');
    
    this.actRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('placeId')) {
        this.router.navigateByUrl('/places/tabs/discover');
        return;
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
      console.log(this.place);
      
    })

  }

  goBack() {
    // different ways to go back...
    // this.router.navigateByUrl("/places/tabs/discover");
    // this.router.navigate(['places', 'tabs', 'discover']);
    // this.navCtrl.back();
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack("/places/tabs/discover");

    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {loadedPlace : this.place}
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    })
    .then(result => {
      console.log(result.data, result.role);
      if (result.role === 'confirm') {
        console.log('BOOKED !!');
      }
    });

  }

}
