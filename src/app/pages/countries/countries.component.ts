import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { PieChart3D } from '@amcharts/amcharts4/charts';
import { any } from '@amcharts/amcharts4/.internal/core/utils/Array';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';


@Component({
	selector: 'app-countries',
	templateUrl: './countries.component.html',
	styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit, AfterViewInit {
	country_list: any;
	currentYear: any;
	country_id: any;
	country_flag: any;
	country_iso_code: any;
	country_name: any;
	governance_id: any;

	health_taxonomy_present: any = [];
	health_taxonomy_prospective: any = [];
	digital_taxonomy_present: any = [];
	digital_taxonomy_prospective: any = [];
	triggerInit: boolean = true;
	countryDetails: any = [];
	newArray: any = []
	readiness_score: any;
	availability_score: any;
	title: any;
	capacity_building_score: any;
	development_strategy_score: any;


	public chart: am4charts.PieChart3D = new PieChart3D;
	@ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;



	constructor(
		private common: CommonService,
		private utilities: UtilitiesService
	) { }

	ngOnInit(): void {

		let chart = am4core.create("chartdiv", am4charts.PieChart);

		// Create pie series
		let series = chart.series.push(new am4charts.PieSeries());
		series.dataFields.value = "litres";
		series.dataFields.category = "country";

		// Add data
		chart.data = [{
			"country": "Lithuania",
			"litres": 501.9
		}, {
			"country": "Czech Republic",
			"litres": 301.9
		}, {
			"country": "Ireland",
			"litres": 201.1
		}, {
			"country": "Germany",
			"litres": 165.8
		}, {
			"country": "Australia",
			"litres": 139.9
		}, {
			"country": "Austria",
			"litres": 128.3
		}, {
			"country": "UK",
			"litres": 99
		}, {
			"country": "Belgium",
			"litres": 60
		}, {
			"country": "The Netherlands",
			"litres": 50
		}];

		// And, for a good measure, let's add a legend
		chart.legend = new am4charts.Legend();

		// this.utilities.governanceTypeSource.subscribe((governanceId) => {

		// 	this.health_taxonomy_present = [];
		// 	this.health_taxonomy_prospective = [];

		// 	if (this.triggerInit) {
		// 		this.getCountriesDetails(governanceId);
		// 	}

		// });

		// this.utilities.showHeaderMenu.next(true);

		// //to get all countries name and flag
		// this.common.getAllCountries().subscribe((res) => {
		// 	this.country_list = res;
		// })

	}

	getSelectedCountry(country: any) {
		// console.log(country);
		if (country) {

			this.country_id = country.country_id;
			this.country_flag = country.flag;
			this.country_iso_code = country.iso_code;
			this.country_name = country.country_name;
			this.currentYear = country.year;

			if (localStorage.getItem('country_id') != null) {
				localStorage.removeItem('country_id');
				localStorage.removeItem('country_flag');
				localStorage.removeItem('country_iso_code');
				localStorage.removeItem('country_name');
				localStorage.removeItem('year');


				localStorage.setItem('country_id', JSON.stringify(this.country_id));
				localStorage.setItem('country_name', JSON.stringify(this.country_name));
				localStorage.setItem('country_flag', JSON.stringify(this.country_flag));
				localStorage.setItem('country_iso_code', JSON.stringify(this.country_iso_code));
				localStorage.setItem('year', JSON.stringify(this.currentYear));
			} else {
				localStorage.setItem('country_id', JSON.stringify(this.country_id));
				localStorage.setItem('country_flag', JSON.stringify(this.country_flag));
				localStorage.setItem('country_iso_code', JSON.stringify(this.country_iso_code));
				localStorage.setItem('year', JSON.stringify(this.currentYear));
			}
		}

	}


	getCountriesDetails(governanceId: any) {

		this.newArray = [];
		this.health_taxonomy_prospective = [];
		this.health_taxonomy_present = [];
		this.digital_taxonomy_present = [];
		this.digital_taxonomy_prospective = [];

		this.country_id = JSON.parse(localStorage.getItem('country_id') || '');
		this.country_name = JSON.parse(localStorage.getItem('country_name') || '');
		this.country_flag = JSON.parse(localStorage.getItem('country_flag') || '');

		this.governance_id = JSON.parse(localStorage.getItem('governance_id') || '');
		this.currentYear = JSON.parse(localStorage.getItem('year') || '');


		this.common.getNdhsCountriesDetails(governanceId, this.country_id, this.currentYear).subscribe((result) => {

			this.countryDetails = result;

			if (governanceId == 1) {

				let presentDevelopment = [this.countryDetails['Present Development']];
				presentDevelopment.forEach((element: any) => {
					Object.keys(element).forEach((key) => {
						// console.log(element);

						// readiness_score
						let readiness_score = parseInt(
							element[key][0].score
						);

						// availability_score
						let availability_score = parseInt(
							element[key][1].score
						);

						// readiness_percentage
						let readiness_percentage = Math.round(
							this.getPercantage(readiness_score)
						);

						// availability_percentage
						let availability_percentage = Math.round(
							this.getPercantage(availability_score)
						);

						// total_percentage
						let total_percentage = readiness_percentage + availability_percentage;

						// remaining_percentage
						let remaining_percentage = 100 - total_percentage;

						let details = {
							title: element[key][0].taxonomy_name,
							governance_type: 'health',
							development_type: 'present',
							readiness_score: readiness_score,
							availability_score: availability_score,
							readiness_percentage: readiness_percentage,
							availability_percentage: availability_percentage,
							remaining_percentage: remaining_percentage,
							taxonomy_id: element[key][0].taxonomy_id,
							development_id: element[key][0].development_id,
							governance_id: element[key][0].governance_id,
							prefix: 'health_present'

						}

						this.newArray.push(details);
						this.health_taxonomy_present.push(details)
					})

				});


				let prospectiveDevelopment = [this.countryDetails['Prospective Development']];

				prospectiveDevelopment.forEach((element: any) => {
					Object.keys(element).forEach((key) => {
						// console.log(element);

						let development_strategy_score = parseInt(
							element[key][0].score
						);

						let capacity_building_score = parseInt(
							element[key][1].score
						);

						let development_strategy_percentage = Math.round(
							this.getPercantage(development_strategy_score)
						);

						let capacity_building_percentage = Math.round(
							this.getPercantage(capacity_building_score)
						);

						let total_percentage = development_strategy_percentage + capacity_building_percentage;

						let remaining_percentage = 100 - total_percentage;

						let details = {
							title: element[key][0].taxonomy_name,
							governance_type: 'health',
							developement_type: 'prospective',
							capacity_building_score: capacity_building_score,
							development_strategy_score: development_strategy_score,
							capacity_building_percentage: capacity_building_percentage,
							development_strategy_percentage:
								development_strategy_percentage,
							remaining_percentage: remaining_percentage,
							taxonomy_id: element[key][0].taxonomy_id,
							development_id:
								element[key][0].development_id,
							governance_id:
								element[key][0].governance_id,
							prefix: 'health_prospective',
						};

						this.newArray.push(details);
						this.health_taxonomy_prospective.push(details);
					})

				});

			} else {
				let digital_presentDevelopment = [this.countryDetails['Present Development']];

				digital_presentDevelopment.forEach((element: any) => {
					Object.keys(element).forEach((key) => {
						let readiness_score = parseInt(
							element[key][0].score
						);
						let availability_score = parseInt(
							element[key][1].score
						);
						let readiness_percentage = Math.round(
							this.getPercantage(readiness_score)
						);
						let availability_percentage = Math.round(
							this.getPercantage(availability_score)
						);
						let total_percentage =
							readiness_percentage +
							availability_percentage;
						let remaining_percentage =
							100 - total_percentage;
						let details = {
							title: element[key][0].taxonomy_name,
							governance_type: 'health',
							developement_type: 'present',
							readiness_score: readiness_score,
							availability_score: availability_score,
							readiness_percentage: readiness_percentage,
							availability_percentage:
								availability_percentage,
							remaining_percentage: remaining_percentage,
							taxonomy_id: element[key][0].taxonomy_id,
							development_id:
								element[key][0].development_id,
							governance_id:
								element[key][0].governance_id,
							prefix: 'digital_present',
						};
						this.newArray.push(details);
						this.digital_taxonomy_present.push(details);
					});

				});

				let digital_prospectiveDevelopment = [this.countryDetails['Prospective Development']];
				console.log(digital_prospectiveDevelopment);

				digital_prospectiveDevelopment.forEach((element: any) => {
					Object.keys(element).forEach((key) => {
						let capacity_building_score = parseInt(
							element[key][0].score
						);
						let development_strategy_score = parseInt(
							element[key][1].score
						);
						let capacity_building_percentage = Math.round(
							this.getPercantage(capacity_building_score)
						);
						let development_strategy_percentage = Math.round(
							this.getPercantage(development_strategy_score)
						);
						let total_percentage =
							capacity_building_percentage +
							development_strategy_percentage;
						let remaining_percentage =
							100 - total_percentage;
						let details = {
							title: element[key][0].taxonomy_name,
							governance_type: 'health',
							developement_type: 'prospective',
							capacity_building_score: capacity_building_score,
							development_strategy_score: development_strategy_score,
							capacity_building_percentage: capacity_building_percentage,
							development_strategy_percentage:
								development_strategy_percentage,
							remaining_percentage: remaining_percentage,
							taxonomy_id: element[key][0].taxonomy_id,
							development_id:
								element[key][0].development_id,
							governance_id:
								element[key][0].governance_id,
							prefix: 'digital_prospective',
						};

						this.newArray.push(details);
						this.digital_taxonomy_prospective.push(details);
					});
				})
			}

			this.ngAfterViewInit();

		})

	}


	getPercantage(value: number) {
		let per = (value / 200) * 100;
		return per;
	}

	ngAfterViewInit() {

		if (this.governance_id == 1) {
			this.createCharts(this.health_taxonomy_present, 'chartdiv_health_present', '#1181B2', '#05D5AA');
			this.createCharts(this.health_taxonomy_prospective, 'chartdiv_health_prospective', '#2F4770', '#0860FE');
		} else {
			this.createCharts(this.digital_taxonomy_present, 'chartdiv_digital_present', '#71ADB5', '#1F914F');
			this.createCharts(this.digital_taxonomy_prospective, 'chartdiv_digital_prospective', '#14CCAA', '#41565A');
		}
	}



	createCharts(taxonomyData: any[], containerId: string, color1: string, color2: string) {


		taxonomyData.forEach((taxonomy: any, index: number) => {
			const chartContainer = document.createElement('div');
			chartContainer.id = containerId + index;

			console.log(chartContainer);

			console.log(this.chartContainer);

			if (this.chartContainer && this.chartContainer.nativeElement) {
				this.chartContainer.nativeElement.appendChild(chartContainer);
				const chart = am4core.create(chartContainer.id, am4charts.PieChart3D);

				chart.data = [
					{
						taxonomy: 'Readiness',
						percentage: taxonomy.readiness_percentage,
					},
					{
						taxonomy: 'Availability',
						percentage: taxonomy.availability_percentage,
					},
					{
						percentage: taxonomy.remaining_percentage,
					},
				];

				chart.innerRadius = 40;
				chart.depth = 10;

				const series = chart.series.push(new am4charts.PieSeries3D());
				series.dataFields.value = 'percentage';
				series.dataFields.category = 'taxonomy';

				series.slices.template.tooltipText = '{category}';
				series.labels.template.text = '{taxonomy}';
				series.labels.template.maxWidth = 70;
				series.labels.template.wrap = true;

				series.colors.list = [
					new (am4core.color as any)(color1),
					new (am4core.color as any)(color2),
					'#E2E2E4'
				];

				const label = series.createChild(am4core.Label);

				label.text =
					taxonomy.readiness_percentage +
					taxonomy.availability_percentage +
					'%';
				label.horizontalCenter = 'middle';
				label.verticalCenter = 'middle';
				label.fontSize = 26;
				label.fontWeight = 'normal';

				series.ticks.template.events.on('ready', hideSmall);
				series.ticks.template.events.on('visibilitychanged', hideSmall);
				series.labels.template.events.on('ready', hideSmall);
				series.labels.template.events.on('visibilitychanged', hideSmall);

				function hideSmall(ev: any) {
					if (!ev.target.dataItem.hasProperties || ev.target.dataItem.dataContext.percentage === 0) {
						ev.target.hide();
					} else {
						ev.target.show();
					}
				}


			}
		});
	}







}
