import { OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { HttpService } from './services/http.service';

import sortByDistance from 'sort-by-distance';

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
  parkingLocations: object;
  redDotIcon: string = "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi2.png";
  parkingIcon: string = "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png";


  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getUserLocation();
  }

  getUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((location)=> {
        this.userLat = location.coords.latitude;
        this.userLng = location.coords.longitude;
        this.coords.nativeElement.innerHTML = `Your latitude: ${this.userLat}<br>Your longitude: ${this.userLng}`;
      });
    } else {
      this.coords.nativeElement.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  getParkingLocations(): void {
    this.httpService.getParkingStations()
      .then(()=> this.parkingLocations = this.httpService.results)
      .then(()=> this.getNearestLocation(this.parkingLocations))
      .catch((err)=> {
        if (!err.ok) {
          console.error(err);
          this.coords.nativeElement.innerHTML += `<br><h4 style="color:red">ERROR: ${err.statusText} ${err.status}: can't get the parking station locations</h4>`;
        } else {
          console.error(err);
          this.coords.nativeElement.innerHTML += `<br><h4 style="color:orange">WARNING: ${err.statusText} ${err.status}: response data is an empty array. </h4>`;
        }
      })
  }

  getNearestLocation(parkingLocations: object): void {
    const opts = {
      xName: 'latitude',
      yName: 'longitude'
    }
    const origin = { latitude: this.userLat, longitude: this.userLng }

    const sortedParkingLocations = sortByDistance(origin, parkingLocations, opts);
    this.coords.nativeElement.innerHTML += `<br>Distance between You and the nearby parking station: ${(sortedParkingLocations[0]['distance']*100).toFixed(2)} km`
    this.parkingLat = sortedParkingLocations[0]['latitude'];
    this.parkingLng = sortedParkingLocations[0]['longitude'];
  }
}
