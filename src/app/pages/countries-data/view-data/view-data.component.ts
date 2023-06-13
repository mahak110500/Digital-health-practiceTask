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

	async ViewData(governanceId: number) {
		try {
			this.isLoading = true;

			const data = {
				countries: "14",
				governanceId: governanceId
			};

			const res = await this.viewdataService.getViewData(data).toPromise();
			this.isLoading = false;

			const developmentTypes: [string, any][] = Object.entries(res);

			this.developmentName = developmentTypes.map(([name]) => name);
			this.developmentType = developmentTypes.map(([, type]) => type);

			const presentData: { [key: string]: any } = {};
			const prospectiveData: { [key: string]: any } = {};

			Object.entries(this.developmentType).forEach(([key, value]) => {
				if (key === "0") {
					presentData["Availability"] = (value as { [key: string]: any })["Availability"];
					presentData["Readiness"] = (value as { [key: string]: any })["Readiness"];
				} else if (key === "1") {
					prospectiveData["Capacity Building"] = (value as { [key: string]: any })["Capacity Building"];
					prospectiveData["Development Strategy"] = (value as { [key: string]: any })["Development Strategy"];
				}
			});

			this.Availability = Object.entries(presentData["Availability"]);
			this.dataAvailability = this.getNestedEntries(this.Availability);
			this.dataAvailability = this.getNestedEntries(this.Availability);
			this.processDataArray(this.dataAvailability, this.availabilityArray);

			this.Readiness = Object.entries(presentData["Readiness"]);
			this.dataReadiness = this.getNestedEntries(this.Readiness);
			this.processDataArray(this.dataReadiness, this.readinessArray);

			this.CapacityBuilding = Object.entries(prospectiveData["Capacity Building"]);
			this.dataCapacityBuild = this.getNestedEntries(this.CapacityBuilding);
			this.processDataArray(this.dataCapacityBuild, this.capacityBuildArray);

			this.DevelopmentStrat = Object.entries(prospectiveData["Development Strategy"]);
			this.dataDevelopmentStrat = this.getNestedEntries(this.DevelopmentStrat);
			this.processDataArray(this.dataDevelopmentStrat, this.DevelopmentStratArray);

			this.ultimate_names = Object.keys(presentData);
			this.ultimate_names2 = Object.keys(prospectiveData);
		} catch (error) {
			// Handle error
			console.error(error);
			this.isLoading = false;
		}
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



	// ViewData(governanceId: number) {
	// 	this.isLoading = true; 

	// 	let data = {
	// 		countries: "14",
	// 		governanceId: governanceId
	// 	}

	// 	this.viewdataService.getViewData(data).subscribe(res => {
	// 		this.isLoading = false;
	// 		this.result = Object.entries(res);

	// 		this.developmentName = []; // Clear the arrays for each governance ID
	// 		this.developmentType = [];
	// 		this.dataAvailability = [];
	// 		this.dataReadiness = [];
	// 		this.dataCapacityBuild = [];
	// 		this.dataDevelopmentStrat = [];
	// 		this.availabilityArray = [];
	// 		this.readinessArray = [];
	// 		this.capacityBuildArray = [];
	// 		this.DevelopmentStratArray = [];


	// 		for (const array of this.result) {
	// 			this.developmentName.push(array[0]);
	// 			this.developmentType.push(array[1])

	// 		}
	// 		const presentData: any = {};
	// 		const prospectiveData: any = {};

	// 		Object.keys(this.developmentType).forEach(key => {
	// 			if (key === "0") {
	// 				presentData["Availability"] = this.developmentType[key]["Availability"];
	// 				presentData["Readiness"] = this.developmentType[key]["Readiness"];
	// 			} else if (key === "1") {
	// 				prospectiveData["Capacity Building"] = this.developmentType[key]["Capacity Building"];
	// 				prospectiveData["Development Strategy"] = this.developmentType[key]["Development Strategy"];
	// 			}
	// 		});


	// 		this.Availability = Object.entries(presentData.Availability)

	// 		this.Availability.forEach((element: any, index: any) => {

	// 			element[1];
	// 			this.entries = Object.entries(element[1]);

	// 			if (index == 0) {
	// 				this.dataAvailability.push(this.entries);
	// 			}
	// 			if (index) {
	// 				this.dataAvailability.push(this.entries);
	// 			}

	// 		})

	// 		console.log(this.dataAvailability);
			
	// 		this.dataAvailability.forEach((element1: any, index1: any) => {
	// 			element1.forEach((element2: any, index2: any) => {
	// 				this.availabilityArray.push(element2);
	// 			})
	// 		})
	// 		console.log(this.availabilityArray);
			

	// 		this.ultimate_names = Object.keys(presentData);


	// 		this.Readiness = Object.entries(presentData.Readiness)

	// 		this.Readiness.forEach((element: any, index: any) => {

	// 			element[1];
	// 			this.entries = Object.entries(element[1]);

	// 			if (index == 0) {
	// 				this.dataReadiness.push(this.entries);
	// 			}
	// 			if (index) {
	// 				this.dataReadiness.push(this.entries);
	// 			}
	// 		})

	// 		this.dataReadiness.forEach((element1: any, index1: any) => {
	// 			element1.forEach((element2: any, index2: any) => {
	// 				this.readinessArray.push(element2);
	// 			})
	// 		})

	// 		this.CapacityBuilding = Object.entries(prospectiveData["Capacity Building"])

	// 		this.CapacityBuilding.forEach((element: any, index: any) => {

	// 			element[1];
	// 			this.entries = Object.entries(element[1]);

	// 			if (index == 0) {
	// 				this.dataCapacityBuild.push(this.entries);
	// 			}
	// 			if (index) {
	// 				this.dataCapacityBuild.push(this.entries);
	// 			}

	// 		})

	// 		this.dataCapacityBuild.forEach((element1: any, index1: any) => {
	// 			element1.forEach((element2: any, index2: any) => {
	// 				this.capacityBuildArray.push(element2);
	// 			})
	// 		})


	// 		this.DevelopmentStrat = Object.entries(prospectiveData["Development Strategy"])

	// 		this.DevelopmentStrat.forEach((element: any, index: any) => {

	// 			element[1];
	// 			this.entries = Object.entries(element[1]);

	// 			if (index == 0) {
	// 				this.dataDevelopmentStrat.push(this.entries);
	// 			}
	// 			if (index) {
	// 				this.dataDevelopmentStrat.push(this.entries);
	// 			}

	// 		})
	// 		this.dataDevelopmentStrat.forEach((element1: any, index1: any) => {
	// 			element1.forEach((element2: any, index2: any) => {
	// 				this.DevelopmentStratArray.push(element2);
	// 			})
	// 		})

	// 		this.ultimate_names2 = Object.keys(prospectiveData);

	// 	});


	// }

}
