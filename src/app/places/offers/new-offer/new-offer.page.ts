import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

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
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  onAddNewOffer() {
    if (!this.form.valid) {
      return;
    }
    
    console.log("Creating new offer...");
    console.log(this.form.value['dateFrom']);
    
    this.loadingCtrl.create({keyboardClose: true, message: "Creating offer"}).then(loadingEl => {
      loadingEl.present();

      this.offerSub = this.placesService.addPlace(
        this.form.value['title'],
        this.form.value['description'],
        this.form.value['price'],
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
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

}
