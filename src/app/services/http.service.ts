import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  apiRoot: string = "https://kozutnhptest.azurewebsites.net";
  results: Object[];

  constructor(private http: Http) {
    this.results = [];
  }

  getParkingStations() {
    let promise = new Promise((resolve, reject) => {
      let url = `${this.apiRoot}/api/Map/GetParkingStations`;
      this.http.get(url)
        .toPromise()
        .then(res => {
          if (res.json().length == 0) {
            //console.log(res.json());
            reject(res);
          } else {
            this.results = res.json();
            resolve();
          }
        },
        msg => {
          reject(msg);
        }
      )
    })
    return promise;
  }
}
