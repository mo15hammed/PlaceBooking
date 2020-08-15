import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { CameraPhoto } from '@capacitor/core';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit, OnDestroy {

  private offerSub: Subscription;
  public form: FormGroup;

  constructor(private placesService: PlacesService, private navCtrl: NavController, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(new Date().toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(new Date().toISOString(), {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {validators: [Validators.required]})
    });
  }

  onLocationPicked(event) {    
    this.form.patchValue({location: event});
  }

  onImagePicked(cameraPhoto: CameraPhoto) {
    console.log('image Picked');
    console.log(cameraPhoto);
    
    let imageFile;
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = fetch(cameraPhoto.webPath!).then(response => {
      response.blob().then(file => {
        imageFile = file;
        console.log(imageFile);
        this.form.patchValue({image: imageFile});
      })
    });

  }

  onAddNewOffer() {
    if (!this.form.valid) {
      return;
    }
    
    console.log("Creating new offer...");
    console.log(this.form.value.location);
    
    this.loadingCtrl.create({keyboardClose: true, message: "Creating offer"}).then(loadingEl => {
      loadingEl.present();

      this.offerSub = this.placesService.addPlace(
        this.form.value['title'],
        this.form.value['description'],
        this.form.value['price'],
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
        this.form.value.location
      ).subscribe(() => {

        console.log("offer Created");
        loadingEl.dismiss();
        this.form.reset();
        this.navCtrl.navigateBack("/places/tabs/offers");
    
      });
    });
  }

  ngOnDestroy() {
    if(this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }





  private base64ToBlob(base64: string, mime: string) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
  }
}
