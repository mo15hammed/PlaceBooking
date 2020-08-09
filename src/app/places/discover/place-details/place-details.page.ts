import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController } from '@ionic/angular';
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
    private modalCtrl: ModalController,
    private actSheetCtrl: ActionSheetController
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

  onPlaceBook() {
    // different ways to go back...
    // this.router.navigateByUrl("/places/tabs/discover");
    // this.router.navigate(['places', 'tabs', 'discover']);
    // this.navCtrl.back();
    // this.navCtrl.pop();
    // this.navCtrl.navigateBack("/places/tabs/discover");


    this.actSheetCtrl.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actSheetEl => {
      actSheetEl.present();
    });


    
  }


  openBookingModal(mode: 'select' | 'random') {
    console.log(mode);

    this.modalCtrl.create({
      component: CreateBookingComponent,
      componentProps: {loadedPlace : this.place, selectedMode: mode}
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
