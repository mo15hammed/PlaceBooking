import { Injectable } from '@angular/core';

import { Place } from './places.model'
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, delay, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location-model';

interface PlaceInterface {
  availableFrom: Date;
  availableTo: Date;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  location: PlaceLocation;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})

export class PlacesService {

  private _places = new BehaviorSubject<Place[]>([]);

  /**
   * @returns all places as an Observable
   */
  get places() {
    return this._places.asObservable();
  }


  getPlace(placeId: string) {

    return this.httpCilent
      .get<PlaceInterface>(`https://placebooking-5d7b2.firebaseio.com/offered-places/${placeId}.json`)
      .pipe(
        take(1),
        map(resData => {
          return new Place (
            placeId,
            resData.title,
            resData.description,
            resData.imageUrl,
            resData.price,
            new Date(resData.availableFrom),
            new Date(resData.availableTo),
            resData.location,
            resData.userId
          );
        })
      );

    // return this.places.pipe(take(1), map(places => {
      
    //   return {...places.find(p => p.id == placeId)};

    // }))    
  }


  /**
   * fetches all places from firebase realtime database
   * @returns an Observable
   */
  fetchPlaces() {
    return this.httpCilent
      .get<{[key: string]: PlaceInterface}>('https://placebooking-5d7b2.firebaseio.com/offered-places.json')
      .pipe(
        map(resData => {
          const places = [];
          for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
              places.push(new Place(
                key,
                resData[key].title,
                resData[key].description,
                resData[key].imageUrl,
                resData[key].price,
                new Date(resData[key].availableFrom),
                new Date(resData[key].availableTo),
                resData[key].location,
                resData[key].userId,
              ));
            }
          }

          return places;
        }),
        tap(places => {
          console.log("data fetched again");
          this._places.next(places)
        })
      );
      
  }

  /**
   * adds a new place to firebase realtime database
   * @param title title of the new place
   * @param description a short discription for the new place
   * @param price price for the new place
   * @param dateFrom the starting availability date for the place
   * @param dateTo a date in witch the place will no longer be available
   * @returns an Observable
   */
  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {

    let generated_id: string;

    const newPlace: Place = new Place(
      new Date().toISOString(),
      title,
      description,
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
      price,
      dateFrom,
      dateTo,
      location,
      this.authsrevice.userId
    );

    return this.httpCilent
      .post<{name: string}>('https://placebooking-5d7b2.firebaseio.com/offered-places.json', {...newPlace, id: null})
      .pipe(
        switchMap(resData => {
          console.log(resData);
          generated_id = resData.name;
          return this.places;
        }),
        take(1),
        tap(places => {
          newPlace.id = generated_id;
          this._places.next(places.concat(newPlace));
      }));

  }

  /**
   * edits an already existing place
   * @param placeId a unique id
   * @param title the editted title
   * @param description the editted description
   * @returns an Observable
   */
  editPlace(placeId: string, title: string, description: string, price: number, availableFrom: Date, availableTo: Date) {
    let updatedPlaces: Place[];
    return this.places
      .pipe(
        take(1),
        switchMap(places => {
          if (places || places.length < 0) {
            return this.fetchPlaces();
          } 
        }),
        switchMap(places => {
          updatedPlaces = [...places];
          console.log(updatedPlaces);
          const placeIndex = places.findIndex(p => p.id == placeId);
          const oldPlace = updatedPlaces[placeIndex];
          updatedPlaces[placeIndex] = new Place(
            placeId,
            title,
            description,
            oldPlace.imageUrl,
            price,
            availableFrom,
            availableTo,
            oldPlace.location,
            oldPlace.userId
          );

          return this.httpCilent.put(`https://placebooking-5d7b2.firebaseio.com/offered-places/${placeId}.json`, {...updatedPlaces[placeIndex], id: null});
        }),
        tap(() => {return this._places.next(updatedPlaces)})
      );

    
  }

  constructor(private authsrevice: AuthService, private httpCilent: HttpClient) { }
}








/*

[
    new Place(
      "p1",
      "Manhattan Mansion",
      "In the heart of New York City.",
      "https://1.bp.blogspot.com/-t26_UtH2cyM/UYpbaO1q8zI/AAAAAAAAPJw/879aic4E7-M/s1600/020-P1820020.JPG",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    new Place(
      "p2",
      "L'Amour Toujours",
      "A romantic place in Paris.",
      "https://upload.wikimedia.org/wikipedia/commons/e/e6/Paris_Night.jpg",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'a'
    ),
    new Place(
      "p3",
      "The Foggy Palace",
      "Not your average city trip.",
      "https://i.pinimg.com/originals/65/8f/77/658f77b9b527f89922ba996560a3e2b0.jpg",
      199.99,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'abc'
    ),
    
  ]

*/