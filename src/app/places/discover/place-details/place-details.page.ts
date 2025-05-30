import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';
import { PlacesService } from '../../places.service';
import { Place } from '../../places.model';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit, OnDestroy {


  private placesSub: Subscription;
  private place: Place;
  private isLoading: boolean;
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
      this.isLoading = true;
      let fetchedUserId: string;
      this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
          if (!userId) {
            throw new Error('No user id');
          }
          fetchedUserId = userId;
          return this.placesService.getPlace(paramMap.get('placeId'));
        })
      ).subscribe (place => {
        this.isLoading = false;
        this.isBookable = place.userId != fetchedUserId;
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

  onShowMap() {
    this.modalCtrl.create({
      component: MapModalComponent,
      componentProps: {
        title: this.place.location.address,
        isSelectable: false,
        center: {lat: this.place.location.lat, lng: this.place.location.lng}
      }
    }).then(modalEl => {
      modalEl.present();
    })
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
