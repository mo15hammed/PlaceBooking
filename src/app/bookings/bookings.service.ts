import { Injectable } from '@angular/core';
import { Booking } from './booking.model';


@Injectable({providedIn: 'root'})
export class BookingsService {

    private _bookings: Booking[] = [
        new Booking(
            "b1",
            "u1",
            "p1",
            "Manhattan Mansion",
            2
        )
    ];

    public getBookings() {
        return [...this._bookings]
    }

}