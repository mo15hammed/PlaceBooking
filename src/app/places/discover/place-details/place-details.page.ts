import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { PlacesService } from '../../places.service';
import { Place } from '../../places.model';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit, OnDestroy {

  private placesSub: Subscription;
  private place: Place;
  private isBookable: boolean = true;

  constructor(
    private placesService: PlacesService,
    private bookingService: BookingsService,
    private authService: AuthService,
    private actRoute: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private actSheetCtrl: ActionSheetController,
    private loadingCtrl: LoadingController
    ) { }

  ngOnInit() {
    console.log('Place Details page initiated !!');
    
    this.actRoute.paramMap.subscribe(paramMap => {

      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }

      this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe (place => {
        this.isBookable = place.userId != this.authService.userId;
        this.place = place;
        console.log(this.place);      
      });
    })

  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  onPlaceBook() {

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

      if (result.role === 'confirm') {
        const newBooking = {...result.data.bookingData};

        this.loadingCtrl.create({keyboardClose: true, message:'Booking'}).then (loadingEl => {
          loadingEl.present();

          this.bookingService.addBooking(
            this.place.id,
            this.place.title,
            this.place.imageUrl,
            newBooking.firstName,
            newBooking.lastName,
            newBooking.numberOfGuest,
            newBooking.dateFrom,
            newBooking.dateTo
          ).subscribe(() => {
            console.log('BOOKED !!');
            loadingEl.dismiss();
          });

        })

        
      }
    });
    
  }
}
