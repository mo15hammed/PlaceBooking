import { Injectable } from '@angular/core';

import { Place } from './places.model'
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City.",
      "https://1.bp.blogspot.com/-t26_UtH2cyM/UYpbaO1q8zI/AAAAAAAAPJw/879aic4E7-M/s1600/020-P1820020.JPG",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      this.authsrevice.getUserId()
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris.",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      this.authsrevice.getUserId()
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip.",
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      this.authsrevice.getUserId()
    ),
    
  ]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(placeId: String) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id == placeId)};
    }))    
  }


  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const place: Place = new Place(
      new Date().toISOString(),
      title,
      description,
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
      price,
      dateFrom,
      dateTo,
      this.authsrevice.getUserId()
    );
    
    return this.places.pipe(take(1), delay(1000), tap(places => {
      this._places.next(places.concat(place));
    }));

  }

  editPlace(placeId: string, title: string, description: string) {

    return this.places.pipe(take(1), delay(1000), tap(places => {

      const updatedPlaces = [...places];
      const placeIndex = places.findIndex(p => p.id == placeId);
      const oldPlace = updatedPlaces[placeIndex];
      updatedPlaces[placeIndex] = new Place(
        oldPlace.id,
        title,
        description,
        oldPlace.imageUrl,
        oldPlace.price,
        oldPlace.availableFrom,
        oldPlace.availableTo,
        oldPlace.userId
      );

      this._places.next(updatedPlaces);

    }));
    
  }

  constructor(private authsrevice: AuthService) { }
}
