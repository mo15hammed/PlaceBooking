import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PlaceLocation } from 'src/app/places/location-model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {

  @Output() locationPick = new EventEmitter<PlaceLocation>();
  private isLoading = false;
  private placeLocation: PlaceLocation;

  constructor(private mapModal: ModalController, private http: HttpClient) { }

  ngOnInit() {}


  onPickLocation() {
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
      this.isLoading = true;
      console.log("Data: ", modalData.data);
      this.placeLocation = {
        lat: modalData.data.lat,
        lng: modalData.data.lng,
        staticMapImageUrl: "",
        address: ""
      };

      this.getAddress(modalData.data)
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

    });
  }


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

  private getStaticMapImageUrl(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7C${lat},${lng}&key=${environment.MAPS_API_KEY}`;
  }
}
