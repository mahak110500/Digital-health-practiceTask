import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ViewDataService } from 'src/app/services/view-data.service';

@Component({
	selector: 'app-prospective-development',
	templateUrl: './prospective-development.component.html',
	styleUrls: ['./prospective-development.component.css']
})
export class ProspectiveDevelopmentComponent implements OnInit {
	country_name: any;
	country_id: any;
	current_year: any;
	developmentName: any;
	developmentType: any;
	CapacityBuild: any
	dataCapacityBuild: any
	capacityBuildArray: any = [];
	DevelopmentStrat: any
	dataDevlopmentStrat: any
	DevelopmentStratArray: any = [];
	ultimate_names: any;
	isLoading = true;


	constructor(
		private viewdataService: ViewDataService,
		private _utilities: UtilitiesService
	) { }

	ngOnInit(): void {
		this._utilities.showHeaderMenu.next(true);
		// this.governance_id = JSON.parse(localStorage.getItem('governance_id') || '');


		this._utilities.governanceTypeSource.subscribe((governanceId) => {
			this.getProspectiveData(governanceId);
		});
	}

	getProspectiveData(governanceId: any) {
		this.country_name = JSON.parse(localStorage.getItem("country_name") || '');
		this.country_id = JSON.parse(localStorage.getItem("country_id") || '');
		this.current_year = JSON.parse(localStorage.getItem('year') || '');
		let data = {
			countries: this.country_id,
			development_id: 2,
			governanceId: governanceId
		}
		this.isLoading = true;
		this.viewdataService.getViewData(data).subscribe(result => {

			this.isLoading = false;

			const developmentTypes: [string, any][] = Object.entries(result);

			this.developmentType = developmentTypes.map(([, type]) => type);

			const prospectiveData: { [key: string]: any } = {};

			Object.entries(this.developmentType).forEach(([key, value]) => {
				if (key === "0") {
					prospectiveData["Capacity Building"] = (value as { [key: string]: any })["Capacity Building"];
					prospectiveData["Development Strategy"] = (value as { [key: string]: any })["Development Strategy"];
				}
			});


			this.CapacityBuild = Object.entries(prospectiveData["Capacity Building"]);
			this.dataCapacityBuild = this.getNestedEntries(this.CapacityBuild);
			this.processDataArray(this.dataCapacityBuild, this.capacityBuildArray);


			this.DevelopmentStrat = Object.entries(prospectiveData["Development Strategy"]);
			this.dataDevlopmentStrat = this.getNestedEntries(this.DevelopmentStrat);
			this.processDataArray(this.dataDevlopmentStrat, this.DevelopmentStratArray);

			this.ultimate_names = Object.keys(prospectiveData);

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
