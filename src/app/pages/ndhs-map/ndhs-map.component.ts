import { Component, OnInit } from '@angular/core';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { CountriesService } from 'src/app/services/countries.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-ndhs-map',
	templateUrl: './ndhs-map.component.html',
	styleUrls: ['./ndhs-map.component.css']
})
export class NdhsMapComponent implements OnInit {
	chart: any;
	pointSeries: any;
	year: any = [2021];
	countries: any;
	circleProperties: any;
	container: any;
	root: any;
	circle: any;
	bullet: any;
	isLoading = true;
	data2021: any;
	data2022: any;
	year2021: boolean = false;
	year2022: boolean = true;

	constructor(
		private countriesService: CountriesService,
		private router: Router,
	) { }


	ngOnInit(): void {
		this.countriesService.getCountries().subscribe(result => {
			this.data2021 = result[2021];
			this.data2022 = result[2022];
			for (var i = 0; i < this.data2021.length; i++) {
				let country = this.data2021[i];

				addCountry(
					country.lng,
					country.lat,
					country.name,
					country.flag,
					country.id,
					country.iso_code,
					country.year
				);

			}
			this.year2021 = !this.year2021;
			this.year2022 = !this.year2022;
		})

		// Create root and chart
		this.root = am5.Root.new('chartdiv');

		this.root._logo.dispose();
		this.root.setThemes([am5themes_Animated.new(this.root)]);

		this.chart = this.root.container.children.push(
			am5map.MapChart.new(this.root, {
				panX: 'none',
				panY: 'none',
				wheelX: 'none',
				wheelY: 'none',
				projection: am5map.geoMercator(),
			})
		);

		// Create polygon series
		let polygonSeries = this.chart.series.push(
			am5map.MapPolygonSeries.new(this.root, {
				geoJSON: am5geodata_worldLow,
				exclude: ['AQ'],
			})
		);

		polygonSeries.set('fill', am5.color(0xDDDDDD));
		polygonSeries.set('stroke', am5.color(0xffffff));

		polygonSeries.mapPolygons.template.setAll({
			templateField: 'polygonSettings',
			interactive: true,
			strokeWidth: 2,
		});
		
		// mapKey property set to the property that uniquely identifies each country
		this.pointSeries = this.chart.series.push(
			am5map.MapPointSeries.new(this.root, {
				mapKey: "country_id"
			})
		);
		console.log(this.pointSeries.data._values);


		this.pointSeries.bullets.push(() => {
			this.container = am5.Container.new(this.root, {});

			let tooltip: any = am5.Tooltip.new(this.root, {
				getFillFromSprite: false,
				paddingBottom: 0,
				paddingRight: 0,
				paddingLeft: 0,
				paddingTop: 0,
				maxWidth: 200,
			});

			this.circleProperties = {
				radius: 3,
				tooltipY: 0,
				fill: am5.color(0x7589ff),
				strokeWidth: 0,
				strokeOpacity: 0,
				tooltip: tooltip,

				tooltipHTML: `
				<div style="text-align:center; background:#fff; padding:10px; width: 120px;color:grey; border-radius:3px;">
				<img src="{flag}" width="20px" height="20px" style="border-radius:50%"><br>
				{title}</div>
			`,
			};

			this.circle = am5.Circle.new(this.root, this.circleProperties);
			this.container.children.push(this.circle);

			this.circle.events.on("click", (element:any) => {
				const dataContext = element.target.dataItem.dataContext;
				this.handleCountryClick(dataContext);
			});

			this.circle.states.create('hover', {
				radius: 4,
				scale: 2,
				strokeWidth: 3,
				strokeOpacity: 5,
				stroke: am5.color(0x8fb8ff),
			});

			this.isLoading = false;

			return (this.bullet = am5.Bullet.new(this.root, {
				sprite: this.container,
			}));
		});

		let addCountry = (
			longitude: number,
			latitude: number,
			title: string,
			flag: string,
			id: number,
			iso_code: string,
			year: number
		) => {
			this.pointSeries.data.push({
				geometry: { type: 'Point', coordinates: [longitude, latitude] },
				title: title,
				flag: "../../../../../assets/flags/" + flag,
				id: id,
				iso_code: iso_code,
				year: year
			});
		};
	}



	getSelectedYear(ev: any) {
	
        this.year2021 = true;
        this.year = this.year.filter((v: any, i: any, a: any) => a.indexOf(v) === i);
        if (!this.year.includes(ev.target.value)) {
            this.year.push(ev.target.value);
            
        localStorage.removeItem('selected_years');
            localStorage.setItem('selected_years',JSON.stringify(this.year));
        } 
        else {
            this.year.splice(this.year.indexOf(ev.target.value), 1);
            
        localStorage.removeItem('selected_years');
            localStorage.setItem('selected_years',JSON.stringify(this.year));
        }
		this.getMapData();
	}

	getMapData() {
		this.pointSeries.bulletsContainer.children.clear();

		if (this.year.includes('2022') && this.year.includes('2021')) {

			for (var i = 0; i < this.data2021.length; i++) {
				this.data2021[i].circleTemplate = { fill: am5.color(0x7589ff) };
				this.data2022[i].circleTemplate = { fill: am5.color(0xFF0000) };
			}

			this.countries = this.data2021.concat(this.data2022);

			this.pointSeries = this.chart.series.push(
				am5map.MapPointSeries.new(this.root, {})
			);

			this.pointSeries.bullets.push(() => {
				this.container = am5.Container.new(this.root, {});

				let tooltip: any = am5.Tooltip.new(this.root, {
					getFillFromSprite: false,
					paddingBottom: 0,
					paddingRight: 0,
					paddingLeft: 0,
					paddingTop: 0,
					maxWidth: 200,
				});

				tooltip.get('background').setAll({
					fill: am5.color(0xffffff),
				});

				this.circle = am5.Circle.new(this.root, {
					templateField: "circleTemplate",
					radius: 3,
					tooltipY: 0,
					strokeWidth: 0,
					strokeOpacity: 0,
					tooltip: tooltip,
					tooltipHTML: `
                    <div style="text-align:center; background:#fff; padding:10px; width: 120px;color:grey; border-radius:3px;">
                    <img src="{flag}" width="20px" height="20px" style="border-radius:50%"><br>
                    {title}</div>
                `,
				});

				this.container.children.push(this.circle);

				this.circle.states.create('hover', {
					radius: 4,
					fill: am5.color(0xff0000),
					scale: 2,
					strokeWidth: 3,
					strokeOpacity: 5,
					stroke: am5.color(0xff7b7b),
				});

				this.circle.events.on("click", (element:any) => {
					const dataContext = element.target.dataItem.dataContext;
					this.handleCountryClick(dataContext);
				});

				return (this.bullet = am5.Bullet.new(this.root, {
					sprite: this.container,
				}));
			});
			this.year2021 = true;
			this.year2022 = true;

		} else if (this.year.includes('2021')) {
			this.countries = this.data2021;
			this.pointSeries = this.chart.series.push(
				am5map.MapPointSeries.new(this.root, {})
			);

			this.pointSeries.bullets.push(() => {
				this.container = am5.Container.new(this.root, {});

				this.circleProperties.fill = am5.color(0x7589ff);
				this.circle = am5.Circle.new(this.root, this.circleProperties);
				this.container.children.push(this.circle);

				this.circle.states.create('hover', {
					radius: 4,
					scale: 2,
					strokeWidth: 3,
					strokeOpacity: 5,
					stroke: am5.color(0x8fb8ff),
				});

				this.circle.events.on("click", (element:any) => {
					const dataContext = element.target.dataItem.dataContext;
					this.handleCountryClick(dataContext);
				});

				return (this.bullet = am5.Bullet.new(this.root, {
					sprite: this.container,
				}));
			});
			this.year2021 = true;
			this.year2022 = false;
		} else if (this.year.includes('2022')) {
			this.countries = this.data2022;
			this.pointSeries = this.chart.series.push(
				am5map.MapPointSeries.new(this.root, {})
			);

			this.pointSeries.bullets.push(() => {
				this.container = am5.Container.new(this.root, {});

				this.circleProperties.fill = am5.color(0xff0000);
				this.circle = am5.Circle.new(this.root, this.circleProperties);
				this.container.children.push(this.circle);

				this.circle.states.create('hover', {
					radius: 4,
					scale: 2,
					strokeWidth: 3,
					strokeOpacity: 5,
					stroke: am5.color(0xff7b7b),
				});

				this.circle.events.on("click", (element:any) => {
					const dataContext = element.target.dataItem.dataContext;
					this.handleCountryClick(dataContext);
				});


				return (this.bullet = am5.Bullet.new(this.root, {
					sprite: this.container,
				}));
			});
			this.year2021 = false;
			this.year2022 = true;
		} else {
			this.countries = [];
		}

		let addCountry = (
			longitude: number,
			latitude: number,
			title: string,
			flag: string,
			country_id: number,
			iso_code: number,
			year: number,
			circleTemplate: any
		) => {
			this.pointSeries.data.push({
				geometry: { type: 'Point', coordinates: [longitude, latitude] },
				title: title,
				flag: "../../../../../assets/flags/" + flag,
				id: country_id,
				iso_code: iso_code,
				year: year,
				circleTemplate: circleTemplate,
			});
		};
		for (var i = 0; i < this.countries.length; i++) {
			let country = this.countries[i];
			addCountry(
				country.lng,
				country.lat,
				country.name,
				country.flag,
				country.id,
				country.iso_code,
				country.year,
				country.circleTemplate
			);
		}
	}

	handleCountryClick = (dataContext: any) => {
		console.log(dataContext);

		const selectedYears = dataContext.selected_years;
		const countryId = dataContext.id;
		const countryFlag = dataContext.flag;
		const countryIsoCode = dataContext.iso_code;
		const year = dataContext.year;
		const countryName = dataContext.title;

		if (localStorage.getItem("country_id") !== null) {
			localStorage.removeItem("country_id");
			localStorage.removeItem("country_flag");
			localStorage.removeItem("country_iso_code");
			localStorage.removeItem("year");
		}

		localStorage.setItem("country_id", JSON.stringify(countryId));
		localStorage.setItem("country_flag", JSON.stringify(countryFlag));
		localStorage.setItem("country_name", JSON.stringify(countryName));
		localStorage.setItem("country_iso_code", JSON.stringify(countryIsoCode));
		localStorage.setItem("year", JSON.stringify(year));

		this.routeToCountriesData();
	};

	routeToCountriesData() {
		this.router.navigate(['countries']);
	}





}
