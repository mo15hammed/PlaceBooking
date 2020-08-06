import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';
import { Place } from '../places.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  private loadedPlaces: Place[];
  private loadedListPlaces: Place[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.getPlaces();
    this.loadedListPlaces = this.loadedPlaces.slice(1);    
  }

  onFilterPlaces(ev: CustomEvent<any>) {
    console.log(ev.detail);
    
  }

}
