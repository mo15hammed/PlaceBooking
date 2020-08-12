import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsAPILoader } from '@agm/core';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {

  constructor(private modalCCtrl: ModalController, private mapLoader: MapsAPILoader) { }

  @ViewChild('map') mapEl;
  @ViewChild('marker') markerEl;

  
  private lat = 48.858093;
  private lng = 2.294694;
  private selected_lat = 48.858093;
  private selected_lng = 2.294694;
  private zoom = 16;

  ngOnInit() {
    const title = 'My first AGM project';
 
    this.mapLoader.load().then(e => {

      console.log("map ready");
    });

  }

  onCancel() {
    this.modalCCtrl.dismiss();
  }
  markerDragEnd($e: any) {
    console.log($e);

    console.log(this.mapEl.latitude);
    
  }

  onMapClicked($ev: MouseEvent) {

    this.selected_lat = $ev.coords.lat;
    this.selected_lng = $ev.coords.lng;

    const selectedCoords = {lat : this.selected_lat, lng: this.selected_lng};
    this.modalCCtrl.dismiss(selectedCoords);
  }
}
