import { Injectable } from '@angular/core';
import { Booking } from './booking.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { delay, tap, take, map, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Key } from 'protractor';


interface BookingInterface {
    bookedFrom: Date;
    bookedTo: Date;
    firstName: string;
    guestNumber: number;
    lastName: string;
    placeId: string;
    placeImage: string;
    placeTitle: string;
    userId: string;
}

@Injectable({providedIn: 'root'})
export class BookingsService {

    constructor(private authService: AuthService, private httpClient: HttpClient) {}

    private _bookings = new BehaviorSubject<Booking[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }


    /** 
     * fetches all user's booked places from firebase database
    */
    fetchBookings() {
        const bookings = [];

        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                return this.httpClient
                .get<{[key: string]: BookingInterface}>(`https://placebooking-5d7b2.firebaseio.com/booked-places.json?orderBy="userId"&equalTo="${userId}"`)
            }), map(resData => {
                for (const key in resData) {
                    bookings.push(new Booking(
                        key,
                        resData[key].placeId,
                        resData[key].userId,
                        resData[key].placeTitle,
                        resData[key].placeImage,
                        resData[key].firstName,
                        resData[key].lastName,
                        resData[key].guestNumber,
                        new Date(resData[key].bookedFrom),
                        new Date(resData[key].bookedTo),
                    ));
                }
                return bookings;
            }),
            tap(bookings => {
                this._bookings.next(bookings)
            })
        )
    }

    /**
     * adds a new booking to firebase database
     * @param placeId the id of the place that was booked
     * @param placeTitle the title of the place that was booked
     * @param placeImage the image url of the place that was booked
     * @param firstName first name
     * @param lastName last name
     * @param guestNumber number of guests
     * @param dateFrom starting date
     * @param dateTo ending date
     */
    addBooking(
        placeId: string,
        placeTitle: string,
        placeImage: string,
        firstName: string,
        lastName: string,
        guestNumber: number,
        dateFrom: Date,
        dateTo: Date
    ) {


        let generated_id: string;
        let booking: Booking;
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                booking = new Booking(
                    new Date().toISOString(),
                    placeId,
                    userId,
                    placeTitle,
                    placeImage,
                    firstName,
                    lastName,
                    guestNumber,
                    dateFrom,
                    dateTo
                );
                return this.httpClient
                .post<{name: string}>('https://placebooking-5d7b2.firebaseio.com/booked-places.json', {...booking, id: null});
                
            }),
            switchMap(resData => {
                generated_id = resData.name;
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                booking.id = generated_id;
                this._bookings.next(bookings.concat(booking));
            })
        );


    }

    cancelBooking(bookingId: string) {

        return this.httpClient
        .delete(`https://placebooking-5d7b2.firebaseio.com/booked-places/${bookingId}.json`)
        .pipe(
            switchMap(resData => {
                return this.bookings;
            }),
            take(1),
            tap(bookings => {
                this._bookings.next(bookings.filter(p => p.id != bookingId));
            })
        )

        // return this.bookings.pipe(take(1), delay(1000), tap(bookings => {
        //     this._bookings.next(bookings.filter(b => b.id != bookingId));
        // }));
    }

}