import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ComparativeResultService {

	constructor(private http: HttpClient) { }


	// http://3.95.161.176:4000/ndhs-master/comparative-bar-charts

	public baseUrl = "http://3.95.161.176:4000/";

	getChartData(data:any): Observable<any> {
		return this.http.post(this.baseUrl + 'ndhs-master/comparative-bar-charts', data);
	}

	getComparativeOverview(data:any): Observable<any> {
		return this.http.post(this.baseUrl + 'ndhs-master/comparative-overview', data);
	}

	getTopTen(data:any): Observable<any> {
		return this.http.post(this.baseUrl + 'ndhs-master/top-ten-countries-avg', data);
	}
}
