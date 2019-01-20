import { OnInit, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
  parkingIcon: string = "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png";

  constructor(private httpService: HttpService) { }

  ngOnInit() {
    this.getUserLocation();
  }

  ngAfterViewInit() {
    this.getParkingLocations();
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
      .then(()=> this.getNearestLocation(this.httpService.results))
      .catch((err)=> console.error(err))
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
