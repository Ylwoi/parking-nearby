import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('latLong') coords: ElementRef;
  userLat: number;
  userLng: number;
  parkingLat: number;
  parkingLng: number;
  apiRoot: string = "https://kozutnhptest.azurewebsites.net";
  //parkingLocations: Object;

  constructor(private http: Http) { }

  ngAfterViewInit() {
    this.getUserLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location)=> {
        this.userLat = location.coords.latitude;
        this.userLng = location.coords.longitude;
        this.coords.nativeElement.innerHTML = "Your latitude: " + this.userLat +
        "<br>Your longitude: " + this.userLng;
        this.getParkingLocations();
      });
    } else {
      this.coords.nativeElement.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  getParkingLocations() {
    let url = `${this.apiRoot}/api/Map/GetParkingStations`;
    this.http.get(url).subscribe(res => {
      this.getNearestLocation(res.json())
    });
  }

  getNearestLocation(parkingLocations: Object) {
    console.log(parkingLocations)
  }

}
//455
