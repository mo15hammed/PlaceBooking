import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController, ActionSheetController, AlertController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PlaceLocation } from 'src/app/places/location-model';
import { Geolocation, Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  private isLoading = false;
  private placeLocation: PlaceLocation;

  constructor(private mapModal: ModalController, private http: HttpClient, private actSheetCtrl: ActionSheetController, private alertCtrl: AlertController) { }

  ngOnInit() {}


  onPickLocation() {

    this.actSheetCtrl.create({
      header: 'Choose wisely',
      buttons: [
        {
          text: 'Pick Location',
          handler: () => { this.showMap() }
        },
        {
          text: 'Current Location',
          handler: () => { this.getCurrentLocation() }
        },
        {
          text: 'Cancel',
          role: 'canel'
        }
      ]
    }).then(actEl => {actEl.present()});


  }

  /**
   * gets the devices current location
   */
  getCurrentLocation() {
    this.isLoading = true;
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return
    }

    Geolocation.getCurrentPosition().then(position => {
    console.log("############### getting location");
      this.definePlaceLocation(position.coords.latitude, position.coords.longitude);

    }).catch(()=> {

      this.showErrorAlert();
    });
    // console.log('Current = ', coords);
    
  }

  /**
   * show an alert error message that the current position could not be fetched.
   */
  showErrorAlert() {
    console.log("############### showing error");
    
    this.alertCtrl.create({
      header: 'Couldn\'t get location',
      message: 'Pleace pick a location from the map manually.',
      buttons: [{text: 'Okay', role: 'cancel'}]
    }).then(alertEl => {
      alertEl.present();
      return alertEl.onDidDismiss();
    }).then(() => {
    console.log("############### dismissing error");
      this.isLoading = false;
    });
  }

  /**
   * diplays the map modal
   */
  showMap() {
    this.mapModal.create({
      component: MapModalComponent,
      componentProps: {
        title: 'Pick location',
        center: this.placeLocation ? {lat: this.placeLocation?.lat, lng: this.placeLocation?.lng} : {lat: 48.858093, lng: 2.294694},
        isSelectable: true
      }
    }).then(modalEl => {

      modalEl.present();
      return modalEl.onDidDismiss();

    }).then (modalData => {
      if (!modalData.data) {
        return;
      }
      console.log("Data: ", modalData.data);


      this.definePlaceLocation(modalData.data.lat, modalData.data.lng);

      

    });
  }

  /**
   * asigns the 'placeLocation' global variable
   * @param latitude 
   * @param longitude 
   */
  definePlaceLocation(latitude: number, longitude: number) {
    this.isLoading = true;

    this.placeLocation = {
      lat: latitude,
      lng: longitude,
      staticMapImageUrl: "",
      address: ""
    };

    this.getAddress({lat: latitude, lng: longitude})
        .pipe(
          switchMap((address) => {
            this.placeLocation.address=address;
            this.placeLocation.staticMapImageUrl = this.getStaticMapImageUrl(this.placeLocation.lat, this.placeLocation.lng, 14);
            return of(this.placeLocation);
          })
        ).subscribe(placeLocation => {
          console.log(placeLocation.address);
          this.isLoading = false;
          
          this.locationPick.emit(placeLocation);
        });
  }

  /**
   * gets address for the given coordinates using GeoCode google api
   * @param coords the latitude and longitude for the location
   * @returns the string address of the location
   */
  private getAddress(coords: {lat: number, lng: number}) {
    return this.http
    .get<any>(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${environment.MAPS_API_KEY}`)
    .pipe(
      map(resData => {
        if (!resData || !resData.results || resData.results.length <= 0) {
          return;
        }
        return resData.results[0].formatted_address;
      })
    );
  }

  /**
   * get a static image for a given location using StaticMap google api
   * @param lat the latitude
   * @param lng the longitude
   * @param zoom the zoom level of the map
   * @returns the url of the static map image
   */
  private getStaticMapImageUrl(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7C${lat},${lng}&key=${environment.MAPS_API_KEY}`;
  }
}
