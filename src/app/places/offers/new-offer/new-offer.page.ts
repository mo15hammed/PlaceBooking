import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  public form: FormGroup;

  constructor(private placesService: PlacesService, private navCtrl: NavController) { }

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
    
    this.placesService.addPlace(
      this.form.value['title'],
      this.form.value['description'],
      this.form.value['price'],
      new Date(this.form.value.dateFrom),
      new Date(this.form.value.dateTo),
    );

    this.form.reset();
    this.navCtrl.navigateBack("/places/tabs/offers");

  }


}
