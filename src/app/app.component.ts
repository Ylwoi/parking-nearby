import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';

import Geo from 'geo-nearby';
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
  apiRoot: string = "https://kozutnhptest.azurewebsites.net";
  parkingIcon: string = "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png";
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
      const a = performance.now();
      //this.getNearestLocation(res.json())
      this.getNearestLocation2(res.json());
      const b = performance.now();
      console.log(('It took ' + (b - a) + ' ms.'));
    });
  }

  // getNearestLocation(parkingLocations: Object) {
  //   console.log(parkingLocations);
  //   for (let index in parkingLocations) {
  //     parkingLocations[index]["id"] = index;
  //   }
  //   const parkingLocsSet = Geo.createCompactSet(parkingLocations, { id: 'id', lat: 'latitude', lon: 'longitude' });
  //   console.log(parkingLocsSet);
  //   const geo = new Geo(parkingLocsSet);
  //   console.log(geo.limit(1).nearBy(this.userLat, this.userLng, 10000));
  //   const nearbyParkingId = geo.limit(1).nearBy(this.userLat, this.userLng, 10000)[0]['i'];
  //   console.log(nearbyParkingId);
  //   for (let index in parkingLocations) {
  //     if (parkingLocations[index]['id'] == nearbyParkingId) {
  //       this.parkingLat = parkingLocations[index]["latitude"];
  //       this.parkingLng = parkingLocations[index]["longitude"];
  //       break;
  //     }
  //   }
  // }

  getNearestLocation2(parkingLocations: Object) {
    const opts = {
      xName: 'latitude',
      yName: 'longitude'
    }
    const origin = { latitude: this.userLat, longitude: this.userLng }

    const sortedParkingLocations = sortByDistance(origin, parkingLocations, opts);
    console.log(sortedParkingLocations);
    this.parkingLat = sortedParkingLocations[0]['latitude'];
    this.parkingLng = sortedParkingLocations[0]['longitude'];
  }
}
