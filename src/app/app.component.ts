import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('latLong') coords: ElementRef;

  ngAfterViewInit() {
    console.log(this.coords);
  }

  getLocation() {
    console.log(this.coords)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location)=> {
        this.coords.nativeElement.innerHTML = "Latitude: " + location.coords.latitude +
        "<br>Longitude: " + location.coords.longitude;
      });
    } else {
      this.coords.nativeElement.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

}
