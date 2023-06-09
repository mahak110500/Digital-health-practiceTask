import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ViewDataService {

	constructor(private http: HttpClient) { }

	// public baseUrl = environment.baseUrl;
	public baseUrl = "http://3.95.161.176:4000/";

	getViewData(data: any): Observable<any> {
		return this.http.post(
			this.baseUrl + 'ndhs-master/overview', data
		);
	}
}
