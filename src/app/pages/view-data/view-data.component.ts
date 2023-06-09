import { Component, OnInit } from '@angular/core';
import { ViewDataService } from 'src/app/services/view-data.service';

@Component({
	selector: 'app-view-data',
	templateUrl: './view-data.component.html',
	styleUrls: ['./view-data.component.css']
})
export class ViewDataComponent implements OnInit {
	country_name: string = "Australia"
	result: any = [];
	development_type: any;
	data: any;
	readinessArray: any = [];
	dataAvailability: any = [];
	dataReadiness: any = [];
	availabilityArray: any = [];
	entries: any;
	main: any = [];

	data6: any = [];
	data7: any = [];
	data8: any = [];
	data9: any = [];

	Availability: any = [];
	Readiness: any = [];
	CapacityBuilding: any = [];
	DevelopmentStrat: any = [];
	ultimate_names:any = [];
	ultimate_names2:any = [];
	developmentName: string[] = [];
	developmentType: any = [];


	constructor(
		private viewdataService: ViewDataService,

	) { }

	ngOnInit(): void {
		this.viewData();
	}



	viewData() {

		let data = {
			countries: "14",
			governanceId: "1"
		}

		this.viewdataService.getViewData(data).subscribe(res => {

			this.result = Object.entries(res);

			for (const array of this.result) {
				this.developmentName.push(array[0]);
				this.developmentType.push(array[1])

			}

			const presentData:any = {};
			const prospectiveData:any = {};

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
					this.data6.push(this.entries);
				}
				if (index) {
					this.data6.push(this.entries);
				}

			})

			this.data6.forEach((element1: any, index1: any) => {
				element1.forEach((element2: any, index2: any) => {
					this.data7.push(element2);
				})
			})


			this.DevelopmentStrat = Object.entries(prospectiveData["Development Strategy"])
		

			this.DevelopmentStrat.forEach((element: any, index: any) => {
				
				element[1];
				this.entries = Object.entries(element[1]);
				
				if (index == 0) {
					this.data8.push(this.entries);
				}
				if (index) {
					this.data8.push(this.entries);
				}

			})
			this.data8.forEach((element1: any, index1: any) => {
				element1.forEach((element2: any, index2: any) => {
					this.data9.push(element2);
				})
			})

			this.ultimate_names2 = Object.keys(prospectiveData);

		});


	}

}
