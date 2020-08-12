import { NgModule } from '@angular/core';
import { LocationPickerComponent } from './pickers/location-picker/location-picker.component';
import { MapModalComponent } from './map-modal/map-modal.component';
import { CommonModule } from '@angular/common';

import { AgmCoreModule } from '@agm/core'
import { environment } from 'src/environments/environment';

@NgModule({
    declarations: [LocationPickerComponent, MapModalComponent],
    imports: [CommonModule, AgmCoreModule.forRoot({ apiKey: environment.MAPS_API_KEY })],
    exports: [LocationPickerComponent, MapModalComponent],
    entryComponents: [MapModalComponent]
})
export class SharedModule {

}