import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})

export class CommonService{
    constructor(private http: HttpClient) {}

    public baseUrl = "http://3.95.161.176:4000/";

    public getNdhsCountriesDetails(
        governance_id: number,
        country_id: number,
        year: number
    ): Observable<any> {
        return this.http.get(
            this.baseUrl +
                'ndhs-master/governance-stats/' +
                governance_id +
                '/' +
                country_id +
                '/' +
                year
        );
        //return this.http.get<any>('./assets/data/countries.json');
    }
    
    //api for getting search countries data
    public getAllCountries(): Observable<any> {
        return this.http.get(this.baseUrl + 'ndhs-master/country-list' );
    }

    //Information Report data
    getInformationReportData(data:any):Observable<any>{
        return this.http.post(this.baseUrl + 'ndhs-master/comparative-information', data)
    }


    //Top Countries data
    public getTopCountriesData(data: any): Observable<any> {
        return this.http.post(this.baseUrl + 'ndhs-master/top-countries', data);
    }

    public getComparativeViewDetails(data:any): Observable<any> {
        return this.http.post(this.baseUrl + 'ndhs-master/overview', data);
    }

    //to get all the exiting countries
    public getExistingCountries(data: any): Observable<any> {
        
        let selected_years = JSON.parse(localStorage.getItem("selected_years") || "")
        if (selected_years && selected_years.length == 2) {
            return this.http.get(this.baseUrl + 'ndhs-master/country-list?year=2021');
        } else {
            return this.http.post(
                this.baseUrl + 'ndhs-master/country-list?year=2021',
                data
            );
        }
    }

    public getTaxonomyTableData(data: any): Observable<any> {
        return this.http.post(this.baseUrl + 'ndhs-master/table-chart', data);
    }

    //api for getting BarChart Data
    public getChartData(data:any): Observable<any>{
        return this.http.post(this.baseUrl + 'ndhs-master/stats-graph', data);
    }


    public getRadarChartData(data: any): Observable<any> {
        return this.http.post(this.baseUrl + 'ndhs-master/radar-chart', data);
    }


    public getdefaultCountry(data:any): Observable<any> {
        return this.http.post(this.baseUrl + 'ndhs-master/countries-with-year', data)
    }

}