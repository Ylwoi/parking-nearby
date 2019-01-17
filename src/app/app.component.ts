import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('latLong') coords: ElementRef;
  lat: number;
  lng: number;

  ngAfterViewInit() {
    console.log(this.coords);
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location)=> {
        this.lat = location.coords.latitude;
        this.lng = location.coords.longitude;
        this.coords.nativeElement.innerHTML = "Latitude: " + this.lat +
        "<br>Longitude: " + this.lng;
      });
    } else {
      this.coords.nativeElement.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

}
