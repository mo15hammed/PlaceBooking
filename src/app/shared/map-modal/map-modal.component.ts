import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { MapsAPILoader } from '@agm/core';
import { MouseEvent } from '@agm/core';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit {

  constructor(private modalCCtrl: ModalController) { }

  @Input() isSelectable = true;
  @Input() title = "Pick a location";
  @Input() center = {lat: 48.858093, lng: 2.294694}
  @Input() zoom = 16;
  private selected_lat: number;
  private selected_lng: number;

  ngOnInit() {
    this.selected_lat = this.center.lat;
    this.selected_lng = this.center.lng;  
  }

  onCancel() {
    this.modalCCtrl.dismiss();
  }


  onMapClicked($ev: MouseEvent) {
    if (this.isSelectable) {
      this.selected_lat = $ev.coords.lat;
      this.selected_lng = $ev.coords.lng;

      const selectedCoords = {lat : this.selected_lat, lng: this.selected_lng};
      
      this.modalCCtrl.dismiss(selectedCoords);
    }
  }
}
