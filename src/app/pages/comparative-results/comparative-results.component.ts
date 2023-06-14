import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from 'src/app/services/common.service';
import { ComparativeResultService } from 'src/app/services/comparative-result.service';
import { CountriesService } from 'src/app/services/countries.service';
import { UtilitiesService } from 'src/app/services/utilities.service';
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

@Component({
    selector: 'app-comparative-results',
    templateUrl: './comparative-results.component.html',
    styleUrls: ['./comparative-results.component.css']
})
export class ComparativeResultsComponent implements OnInit, AfterViewInit, OnDestroy {
    countriesToShow: any;
    countrySelected: any;
    selectedYear: any = [];
    selectedCountry: any = [];
    countriesData: any
    toppings = new FormControl();
    mySelections: string[] = [];
    countries2021: any;
    countries2022: any;
    polygonSeries: any;
    pointSeries: any;
    oldSelections: string[] = [];
    root: any;
    chart: any;



    @ViewChild('mySelect') mySelect: ElementRef | any;



    constructor(
        private mapService: CountriesService,
        private utilityService: UtilitiesService,
        private apiService: CommonService,
        private comparativeServices: ComparativeResultService
    ) { }

    ngAfterViewInit(): void {
        this.mapData();
        this.createChart();
    }

    ngOnInit(): void {

        this.apiService.getAllCountries().subscribe((data) => (this.countriesToShow = data));

        this.countrySelected = localStorage.getItem('selected_country');

        this.selectedYear = JSON.parse(
            localStorage.getItem('selected_years') || ''
        );

        this.utilityService.emitDefaultCountries.subscribe((defaultCountry) => {
            this.apiService
                .getdefaultCountry(defaultCountry)
                .subscribe((data) => {
                    this.selectedCountry = data;
                    if (this.countriesData) {
                        this.setCountry();
                    }
                });
        });

        //getting countries data
        this.mapService.getCountries().subscribe((data) => {
            let country = data;
            // console.log(country);

            this.countries2021 = country['2021'];
            this.countries2022 = country['2022'];

            this.countries2022.map((data: any) => {
                return (data.bulletColors = { fill: am5.color(0xff0000) });
            });
            this.countries2021 &&
                this.countries2021.map((data: any) => {
                    return (data.bulletColors = { fill: am5.color(0x7589ff) });
                });
            this.countriesData = {
                ...{ '2021': this.countries2021 },
                ...{ '2022': this.countries2022 },
            };

            this.setCountry();
            // this.getComparitive();
        });
    }
    chart2:any

    // createChart() {
    //     // Create chart instance
    //      this.chart2 = am4core.create("chartdiv", am4charts.RadarChart);

    //     // Add data
    //     this.chart2.data = [{
    //         "country": "Lithuania",
    //         "litres": 501
    //     }, {
    //         "country": "Czech Republic",
    //         "litres": 301
    //     }, {
    //         "country": "Ireland",
    //         "litres": 266
    //     }, {
    //         "country": "Germany",
    //         "litres": 165
    //     }, {
    //         "country": "Australia",
    //         "litres": 139
    //     }, {
    //         "country": "Austria",
    //         "litres": 336
    //     }, {
    //         "country": "UK",
    //         "litres": 290
    //     }, {
    //         "country": "Belgium",
    //         "litres": 325
    //     }, {
    //         "country": "The Netherlands",
    //         "litres": 40
    //     }];

    //     // Create axes
    //     const categoryAxis = this.chart2.xAxes.push(new am4charts.ValueAxis<am4charts.AxisRendererCircular>());


    //     categoryAxis.dataFields.category = "category";

    //     const valueAxis = this.chart2.yAxes.push(new am4charts.CategoryAxis<am4charts.AxisRendererRadial>());

    //     // Create series
    //     const series = this.chart2.series.push(new am4charts.RadarSeries());
    //     series.dataFields.valueY = "value";
    //     series.dataFields.categoryX = "category";
    // }


    createChart() {
        // Create chart instance
        this.chart2 = am4core.create("chartdiv", am4charts.RadarChart);
        this.chart2.padding(0, 0, 0, 0);
    
        // Add data
        this.chart2.data = [
          {
            "country": "Lithuania",
            "litres": 501
          },
          {
            "country": "Czech Republic",
            "litres": 301
          },
          {
            "country": "Ireland",
            "litres": 266
          },
          {
            "country": "Germany",
            "litres": 165
          },
          {
            "country": "Australia",
            "litres": 139
          },
          {
            "country": "Austria",
            "litres": 336
          },
          {
            "country": "UK",
            "litres": 290
          },
          {
            "country": "Belgium",
            "litres": 325
          },
          {
            "country": "The Netherlands",
            "litres": 40
          }
        ];
    
        // Create category axis
        const categoryAxis = this.chart2.xAxes.push(
          new am4charts.CategoryAxis()
        );
        categoryAxis.dataFields.category = "country";
        categoryAxis.renderer.labels.template.location = 0.5;
        categoryAxis.renderer.labels.template.fontSize = 12;
        categoryAxis.renderer.grid.template.disabled = true;
        categoryAxis.renderer.labels.template.radius = am4core.percent(-40);
        categoryAxis.renderer.minGridDistance = 10;
        categoryAxis.renderer.outerRadius = am4core.percent(100);
        categoryAxis.startLocation = 0.5;
        categoryAxis.endLocation = 0.5;
    
        // Create value axis
        const valueAxis = this.chart2.yAxes.push(
          new am4charts.ValueAxis()
        );
        valueAxis.renderer.grid.template.strokeOpacity = 0.1;
        valueAxis.renderer.labels.template.fontSize = 12;
        valueAxis.renderer.labels.template.horizontalCenter = "right";
        valueAxis.min = 0;
        valueAxis.max = 600;
        valueAxis.strictMinMax = true;
    
        // Set grid shape to pentagon
        valueAxis.renderer.grid.template.shape = "pentagon";
    
        // Create series
        const series = this.chart2.series.push(
          new am4charts.RadarSeries()
        );
        series.dataFields.valueY = "litres";
        series.dataFields.categoryX = "country";
        series.strokeWidth = 3;
    
        // Set up tooltip
        series.tooltipText = "{categoryX}: {valueY}";
    
        // Set up fill and stroke colors
        series.fill = am4core.color("#0088cc");
        series.stroke = am4core.color("#0088cc");
    
        // Enable data labels
        series.dataLabels.enabled = true;
        series.dataLabels.fontSize = 12;
        series.dataLabels.adapter.add("text", function(text:any, target:any) {
          return "{valueY}";
        });
    
        // Enable responsive layout
        this.chart2.responsive.enabled = true;
      }
 

      



    setCountry() {
        let countryData: any[] = [];
        this.selectedYear.forEach((year: any) => {


            let countryByYear = this.countriesData[year];

            countryByYear.forEach((data: any) => {
                this.selectedCountry.forEach((country: any) => {
                    if (country.country_id === data.id) {
                        if (this.mySelections.length <= 1) {
                            this.mySelections.push(country.country_id);
                            this.toppings.setValue(this.mySelections);
                        }
                        countryData.push({
                            long: data.lng,
                            lat: data.lat,
                            name: data.name,
                            title: data.name,
                            iso_code: data.iso_code,
                            flagImage: data.flag,
                            flag: '/assets/flags/' + data.flag,
                            country_id: data.id,
                            circleTemplate: data.bulletColors,
                            year: year,
                            id: data.iso_code,
                            polygonSettings: {
                                fill: am5.color(0x84abbd),
                            },
                        });
                    }
                });
            });

            this.polygonSeries.data.setAll(countryData);
            this.pointSeries.data.setAll(countryData);
        });
        this.oldSelections = this.mySelections;

    }

    onSelected() {
        let temp = this.mySelections.filter((obj) => {
            return this.oldSelections.indexOf(obj) == -1
        })

        if (this.toppings.value.length < 3) {
            this.mySelections = this.toppings.value;

            if (this.mySelections.length == 2) {
                this.countrySelected = this.mySelections.toString();
                localStorage.removeItem('selected_country');
                localStorage.setItem('selected_country', this.countrySelected);
                this.mySelect.close();
            }
        } else {
            if (this.toppings.value.length == 3) {
                let index = this.toppings.value.indexOf(temp[0]);

                if (index == 0) {
                    this.toppings.value.pop();
                } else {
                    this.toppings.value.shift();
                }

                this.mySelections = this.toppings.value;
                this.oldSelections = this.mySelections;

                if (this.mySelections.length == 2) {
                    this.countrySelected = this.mySelections.toString();

                    let defaultCountry = {
                        countries: this.countrySelected,
                    };
                    this.utilityService.emitDefaultCountries.next(
                        defaultCountry
                    );

                    // this.getComparitive();

                    localStorage.removeItem('selected_country');
                    localStorage.setItem('selected_country', this.countrySelected);
                    this.mySelect.close();

                }
            }
            console.log(this.mySelections);
            this.toppings.setValue(this.mySelections);
        }

    }

    mapData() {
        // Create root
        this.root = am5.Root.new('mapChart');

        // Set themes
        this.root.setThemes([am5themes_Animated.new(this.root)]);

        // Create chart
        this.chart = this.root.container.children.push(
            am5map.MapChart.new(this.root, {
                panX: 'none',
                panY: 'none',
                wheelX: 'none',
                wheelY: 'none',
                projection: am5map.geoMercator(),
            })
        );

        this.polygonSeries = this.chart.series.push(
            am5map.MapPolygonSeries.new(this.root, {
                geoJSON: am5geodata_worldLow,
                exclude: ['AQ'],
            })
        );
        this.polygonSeries.set('fill', am5.color(0xDDDDDD));
        this.polygonSeries.set('stroke', am5.color(0xffffff));

        this.polygonSeries.mapPolygons.template.setAll({
            templateField: 'polygonSettings',
            interactive: true,
            strokeWidth: 2,
        });

        // Create point series
        this.pointSeries = this.chart.series.push(
            am5map.MapPointSeries.new(this.root, {
                latitudeField: 'lat',
                longitudeField: 'long',
            })
        );

        this.pointSeries.bullets.push(() => {
            var circle = am5.Circle.new(this.root, {
                radius: 3,
                tooltipY: 0,
                fill: am5.color(0xff0000),
                strokeWidth: 0,
                strokeOpacity: 0,
                tooltipHTML: `
                <div style="text-align:center; background:#fff; padding:10px; width: 120px;color:grey; border-radius:3px;">
                <img src="{flag}" width="20px" height="20px" style="border-radius:50%"><br>
                {title}</div>
            `,
            });

            circle.states.create('hover', {
                radius: 4,
                scale: 2,
                strokeWidth: 3,
                strokeOpacity: 5,
                stroke: am5.color(0x8fb8ff),
            });

            circle.events.on('click', (e: any) => {
                let country_id = e.target.dataItem?.dataContext.country_id;
                let country_flag = e.target.dataItem?.dataContext.flagImage;
                let country_iso_code = e.target.dataItem?.dataContext.iso_code;
                let year = e.target.dataItem.dataContext?.year;
                let country_name = e.target.dataItem?.dataContext.title;

                if (localStorage.getItem('country_id') != null) {
                    localStorage.removeItem('country_id');
                    localStorage.removeItem('country_flag');
                    localStorage.removeItem('country_iso_code');
                    localStorage.removeItem('year');
                    localStorage.removeItem('country_name');

                    localStorage.setItem('country_id', JSON.stringify(country_id));
                    localStorage.setItem('country_flag', JSON.stringify(country_flag));
                    localStorage.setItem('country_name', JSON.stringify(country_name));
                    localStorage.setItem('country_iso_code', JSON.stringify(country_iso_code));
                    localStorage.setItem('year', JSON.stringify(year));
                } else {
                    localStorage.setItem('country_id', JSON.stringify(country_id));
                    localStorage.setItem('country_flag', JSON.stringify(country_flag));
                    localStorage.setItem('country_name', JSON.stringify(country_name));
                    localStorage.setItem('country_iso_code', JSON.stringify(country_iso_code));
                    localStorage.setItem('year', JSON.stringify(year));
                }
                this.utilityService.showHeaderMenu.next(true);
            });

            return am5.Bullet.new(this.root, {
                sprite: circle,
            });
        });





    }

    ngOnDestroy(): void {
        // Clean up chart when component is destroyed
        if (this.chart2) {
            this.chart2.dispose();
        }
    }
}






