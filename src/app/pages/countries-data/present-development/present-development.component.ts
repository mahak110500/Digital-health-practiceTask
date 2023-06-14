import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ViewDataService } from 'src/app/services/view-data.service';

@Component({
	selector: 'app-present-development',
	templateUrl: './present-development.component.html',
	styleUrls: ['./present-development.component.css']
})
export class PresentDevelopmentComponent implements OnInit {
	country_name: any;
	country_id: any;
	current_year: any;
	governance_id: any;
	isLoading = true;
	developmentName: any;
	developmentType: any;
	Availability: any;
	Readiness: any;
	dataAvailability: any = [];
	availabilityArray: any = [];
	dataReadiness: any = [];
	readinessArray: any = [];
	ultimate_names: any = [];


	constructor(
		private _utilities: UtilitiesService,
		private viewdataService: ViewDataService,


	) { }

	ngOnInit(): void {
		this._utilities.showHeaderMenu.next(true);

		this._utilities.governanceTypeSource.subscribe((governanceId) => {
			this.getPresentData(governanceId);
		});
	}

	getPresentData(governanceId: any) {
		this.country_name = JSON.parse(localStorage.getItem("country_name") || '');
		this.country_id = JSON.parse(localStorage.getItem("country_id") || '');
		this.current_year = JSON.parse(localStorage.getItem('year') || '');
		let data = {
			countries: this.country_id,
			development_id: 1,
			governanceId: governanceId
		}
		this.viewdataService.getViewData(data).subscribe(result => {
			const developmentTypes: [string, any][] = Object.entries(result);

			this.developmentType = developmentTypes.map(([, type]) => type);

			const presentData: { [key: string]: any } = {};

			Object.entries(this.developmentType).forEach(([key, value]) => {
				if (key === "0") {
					presentData["Availability"] = (value as { [key: string]: any })["Availability"];
					presentData["Readiness"] = (value as { [key: string]: any })["Readiness"];
				} else if (key === "1") {
				}
			});

			this.Availability = Object.entries(presentData["Availability"]);

			this.dataAvailability = this.getNestedEntries(this.Availability);

			this.processDataArray(this.dataAvailability, this.availabilityArray);

			this.Readiness = Object.entries(presentData["Readiness"]);
			this.dataReadiness = this.getNestedEntries(this.Readiness);
			this.processDataArray(this.dataReadiness, this.readinessArray);

			this.ultimate_names = Object.keys(presentData);
		})

	}


	getNestedEntries(entries: [string, any][]): [string, any][][] {
		return entries.map(([, entry]) => Object.entries(entry));
	}

	processDataArray(dataArray: any[], resultArray: any[]) {
		dataArray.forEach((element1: any, index1: any) => {
			element1.forEach((element2: any, index2: any) => {
				resultArray.push(element2);
			});
		});
		
	}
}
