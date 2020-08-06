import { Component, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Booking } from './booking.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  private loadedBookings: Booking[];

  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.loadedBookings = this.bookingsService.getBookings();
  }

  onDeleteBooking(bookingId: string, ionItemSliding: IonItemSliding) {
    ionItemSliding.close();
    console.log("booking (", bookingId, ") deleted !");
    
  }

}
