import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';
import { ViewDataService } from 'src/app/services/view-data.service';

@Component({
	selector: 'app-view-data',
	templateUrl: './view-data.component.html',
	styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {
	governance_id: any;

	country_name: string = "Australia"
	result: any = [];
	development_type: any;
	data: any;
	dataAvailability: any = [];
	dataReadiness: any = [];
	dataCapacityBuild: any = [];
	dataDevelopmentStrat: any = [];

	availabilityArray: any = [];
	readinessArray: any = [];
	capacityBuildArray: any = [];
	DevelopmentStratArray: any = [];

	Availability: any = [];
	Readiness: any = [];
	CapacityBuilding: any = [];
	DevelopmentStrat: any = [];

	entries: any;
	main: any = [];
	ultimate_names: any = [];
	ultimate_names2: any = [];
	developmentName: string[] = [];
	developmentType: any = [];
	isLoading = true;
	country_id: any;


	constructor(
		private viewdataService: ViewDataService,
		private _utilities: UtilitiesService) { }

	ngOnInit(): void {

		this._utilities.showHeaderMenu.next(true);
		// this.governance_id = JSON.parse(localStorage.getItem('governance_id') || '');

		this._utilities.governanceTypeSource.subscribe((governanceId) => {
			this.ViewData(governanceId);
		});
	}



	ViewData(governanceId: number) {
		this.isLoading = true; 
		// console.log(localStorage.getItem("country_id"));
	    // this.country_id = JSON.parse(localStorage.getItem("country_id") || '');


		let data = {
			countries: "14",
			governanceId: governanceId
		}

		this.viewdataService.getViewData(data).subscribe(res => {
			this.isLoading = false;
			this.result = Object.entries(res);

			this.developmentName = []; // Clear the arrays for each governance ID
			this.developmentType = [];
			this.dataAvailability = [];
			this.dataReadiness = [];
			this.dataCapacityBuild = [];
			this.dataDevelopmentStrat = [];
			this.availabilityArray = [];
			this.readinessArray = [];
			this.capacityBuildArray = [];
			this.DevelopmentStratArray = [];


			for (const array of this.result) {
				this.developmentName.push(array[0]);
				this.developmentType.push(array[1])

			}
			const presentData: any = {};
			const prospectiveData: any = {};

			Object.keys(this.developmentType).forEach(key => {
				if (key === "0") {
					presentData["Availability"] = this.developmentType[key]["Availability"];
					presentData["Readiness"] = this.developmentType[key]["Readiness"];
				} else if (key === "1") {
					prospectiveData["Capacity Building"] = this.developmentType[key]["Capacity Building"];
					prospectiveData["Development Strategy"] = this.developmentType[key]["Development Strategy"];
				}
			});


			this.Availability = Object.entries(presentData.Availability)

			this.Availability.forEach((element: any, index: any) => {

				element[1];
				this.entries = Object.entries(element[1]);

				if (index == 0) {
					this.dataAvailability.push(this.entries);
				}
				if (index) {
					this.dataAvailability.push(this.entries);
				}

			})

			this.dataAvailability.forEach((element1: any, index1: any) => {
				element1.forEach((element2: any, index2: any) => {
					this.availabilityArray.push(element2);
				})
			})

			this.ultimate_names = Object.keys(presentData);


			this.Readiness = Object.entries(presentData.Readiness)

			this.Readiness.forEach((element: any, index: any) => {

				element[1];
				this.entries = Object.entries(element[1]);

				if (index == 0) {
					this.dataReadiness.push(this.entries);
				}
				if (index) {
					this.dataReadiness.push(this.entries);
				}
			})

			this.dataReadiness.forEach((element1: any, index1: any) => {
				element1.forEach((element2: any, index2: any) => {
					this.readinessArray.push(element2);
				})
			})

			this.CapacityBuilding = Object.entries(prospectiveData["Capacity Building"])

			this.CapacityBuilding.forEach((element: any, index: any) => {

				element[1];
				this.entries = Object.entries(element[1]);

				if (index == 0) {
					this.dataCapacityBuild.push(this.entries);
				}
				if (index) {
					this.dataCapacityBuild.push(this.entries);
				}

			})

			this.dataCapacityBuild.forEach((element1: any, index1: any) => {
				element1.forEach((element2: any, index2: any) => {
					this.capacityBuildArray.push(element2);
				})
			})


			this.DevelopmentStrat = Object.entries(prospectiveData["Development Strategy"])

			this.DevelopmentStrat.forEach((element: any, index: any) => {

				element[1];
				this.entries = Object.entries(element[1]);

				if (index == 0) {
					this.dataDevelopmentStrat.push(this.entries);
				}
				if (index) {
					this.dataDevelopmentStrat.push(this.entries);
				}

			})
			this.dataDevelopmentStrat.forEach((element1: any, index1: any) => {
				element1.forEach((element2: any, index2: any) => {
					this.DevelopmentStratArray.push(element2);
				})
			})

			this.ultimate_names2 = Object.keys(prospectiveData);

		});


	}

}
