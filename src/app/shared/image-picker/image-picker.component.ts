import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Capacitor, Camera, CameraSource, CameraResultType, CameraPhoto } from '@capacitor/core';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Output() imagePick = new EventEmitter<CameraPhoto>();
  private selectedImage: string;

  constructor() { }

  ngOnInit() {}


  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }

    Camera.getPhoto({
      quality: 50,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.Uri
    }).then(image => {
      
      console.log("Paaaaaaaaath", image.webPath);     

      this.selectedImage = image.webPath;

      this.imagePick.emit(image);
    }).catch(err => {
      console.log(err);
      return;
      
    });
  }


}
