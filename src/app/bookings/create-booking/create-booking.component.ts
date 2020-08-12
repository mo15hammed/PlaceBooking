import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { Place } from '../../places/places.model';
import { ModalController } from '@ionic/angular';
import {  NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  @ViewChild('f') form: NgForm; 

  @Input() loadedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  startDate: string;
  endDate: string;


  constructor(
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
  
    // console.log(this.loadedPlace);
    

    const availableFrom = new Date(this.loadedPlace.availableFrom);
    const availableTo = new Date(this.loadedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();
      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }


  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onPlaceBook() {
    if (!this.form.valid || !this.datesValid()){
      return;
    }

    this.modalCtrl.dismiss({bookingData: {
      firstName: this.form.value['first-name'],
      lastName: this.form.value['last-name'],
      numberOfGuest: this.form.value['number-of-guests'],
      dateFrom: new Date(this.form.value['date-from']),
      dateTo: new Date(this.form.value['date-to']),
    }},
      'confirm',
    );
  }

  datesValid() {
    if (this.form != undefined && this.form.value['date-from'] && this.form.value['date-to']) {
      
      const startDate = new Date(this.form.value['date-from']);
      const endDate = new Date(this.form.value['date-to']);
      
      return endDate >= startDate;
    }
    return false;
  }

}
