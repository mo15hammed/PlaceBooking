import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  private offersSub : Subscription;
  offer: Place;
  form: FormGroup;

  constructor(private placesService: PlacesService,private actRoute: ActivatedRoute, private navCtrl: NavController) { }

  ngOnInit() {

    this.actRoute.paramMap.subscribe(paramMap => {
      
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.offersSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe (offer => {
        this.offer = offer;
      })

      // this.offer = this.placesService.getPlace(paramMap.get('placeId'));
      // console.log("Offer : ", this.offer);

      this.form = new FormGroup({
        title: new FormControl(this.offer.title, {
          updateOn: 'change',
          validators: [Validators.required]
        }),
        description: new FormControl(this.offer.description, {
          updateOn: 'change',
          validators: [Validators.required, Validators.maxLength(180)]
        }),
        price: new FormControl(this.offer.price, {
          updateOn: 'change',
          validators: [Validators.required, Validators.min(1)]
        }),
        dateFrom: new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        }),
        dateTo:  new FormControl(null, {
          updateOn: 'blur',
          validators: [Validators.required]
        })
      });
      
    })
  }

  ngOnDestroy() {
    if (this.offersSub) {
      this.offersSub.unsubscribe;
    }
  }
  onEditOffer() {
    if (!this.form.valid) {
      return;
    }
    
    console.log("editted !!");
    
    
    
  }

}
