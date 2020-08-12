import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  private isLoading: boolean;
  private offerSub : Subscription;
  private offerEditSub : Subscription;
  offer: Place;
  form: FormGroup;

  constructor(
    private placesService: PlacesService,
    private actRoute: ActivatedRoute,
    private navCtrl: NavController, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

  ngOnInit() {

    this.actRoute.paramMap.subscribe(paramMap => {
      
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }

      this.isLoading = true;
      this.offerSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe (offer => {
        this.isLoading = false;
        this.offer = offer;

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
          dateFrom: new FormControl(this.offer.availableFrom.toISOString(), {
            updateOn: 'blur',
            validators: [Validators.required]
          }),
          dateTo:  new FormControl(this.offer.availableTo.toISOString(), {
            updateOn: 'blur',
            validators: [Validators.required]
          })
        });
        
      }, error => {
        this.alertCtrl.create({
          header: 'Error',
          message: 'An error occurred. Place could not be fetch. try again later',
          buttons: [
            {text: 'Okay', handler: () => {
              this.navCtrl.navigateBack('places/tabs/offers');
            }}
          ]
        }).then(alertEl => {
          alertEl.present();
        });
      });

      // this.offer = this.placesService.getPlace(paramMap.get('placeId'));
      // console.log("Offer : ", this.offer);

      
    })
  }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe;
    }
    if (this.offerEditSub) {
      this.offerEditSub.unsubscribe();
    }
  }
  onEditOffer() {
    if (!this.form.valid) {
      return;
    }

    this.loadingCtrl.create({keyboardClose: true, message: "Updating offer"}).then(loadingEl => {
      loadingEl.present();

      this.offerEditSub = this.placesService
        .editPlace(
          this.offer.id,
          this.form.value.title,
          this.form.value.description,
          this.form.value.price,
          this.form.value.dateFrom,
          this.form.value.dateTo
        ).subscribe(offer => {
        console.log(offer);
        
        loadingEl.dismiss();
        this.navCtrl.navigateBack("/places/tabs/offers");

      });

    });
    
    console.log("editted !!");
    
    
    
  }

}
