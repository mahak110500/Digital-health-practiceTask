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
import * as echarts from 'echarts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4plugins_forceDirected from '@amcharts/amcharts4/plugins/forceDirected';
import * as am4charts from '@amcharts/amcharts4/charts';






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
    isValue: any = '1';
    governance_id: any;
    development_id: any;
    taxonomyData: any
    developmentName: string[] = [];
    developmentType: any;
    Availability: any;
    Readiness: any;
    CapacityBuilding: any;
    DevelopmentStrat: any;
    dataAvailability: any = [];
    dataReadiness: any = [];
    dataCapacityBuild: any = [];
    dataDevelopmentStrat: any = [];
    availabilityArray: any = [];
    readinessArray: any = [];
    capacityBuildArray: any = [];
    DevelopmentStratArray: any = [];
    result1: any = [];
    option: any;
    chart2: any;
    presentType: any[] = [];
    prospectiveType: any[] = [];
    dom: any;
    newDataArray: any[] = [];
    extractedObjects: any = [];
    extractedObjects2: any[] = [];
    extractedObjects3: any[] = [];
    extractedObjects4: any[] = [];

    step = 0;
    stepinner = 0;

    setStep(index: number) {
        this.step = index;
    }
    @ViewChild('mySelect') mySelect: ElementRef | any;
    @ViewChild('radarChartContainer', { static: true }) radarChartContainer!: ElementRef;
    @ViewChild('topChart', { static: true })chartElement!: ElementRef;
    constructor(
        private mapService: CountriesService,
        private utilityService: UtilitiesService,
        private apiService: CommonService,
        private comparativeServices: ComparativeResultService
    ) { }


    ngAfterViewInit(): void {
        this.mapData();
        this.createNetworkChart();
    }

    ngOnInit(): void {
        this.apiService.getAllCountries().subscribe((data) => (this.countriesToShow = data));

        this.countrySelected = localStorage.getItem('selected_country');

        this.selectedYear = JSON.parse(localStorage.getItem('selected_years') || '');
        const stringValues = this.selectedYear.map((value: any) => String(value));
        const uniqueValues = Array.from(new Set(stringValues));
        this.selectedYear = uniqueValues;


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
        });

        this.utilityService.governanceTypeSource.subscribe((governanceId) => {
            this.governance_id = governanceId;
            this.getTopTenData(this.governance_id)
            this.BarGraphData(this.governance_id)
            this.comparativeOverViewData(this.governance_id);
            this.createRadarChart(this.governance_id);
        });

    }

    getTopTenData(governanceId: any) {
        let data = {
            countries: this.countrySelected,
            governanceId: governanceId,
            year: this.selectedYear
        }

        this.comparativeServices.getTopTen(data).subscribe(res => {
            const developmentTypes: [string, any][] = Object.entries(res);
            this.developmentName = developmentTypes.map(([name]) => name);
            this.developmentType = developmentTypes.map(([, type]) => type);

            const presentData: { [key: string]: any } = {};
            const prospectiveData: { [key: string]: any } = {};

            Object.entries(this.developmentType).forEach(([key, value]) => {
                if (key === "0") {
                    prospectiveData["Capacity Building"] = (value as { [key: string]: any })["Capacity Building"];
                    prospectiveData["Development Strategy"] = (value as { [key: string]: any })["Development Strategy"];
                } else if (key === "1") {
                    presentData["Availability"] = (value as { [key: string]: any })["Availability"];
                    presentData["Readiness"] = (value as { [key: string]: any })["Readiness"];
                }
            });

            this.Availability = Object.entries(presentData["Availability"]);
            this.Readiness = Object.entries(presentData["Readiness"]);
            this.CapacityBuilding = Object.entries(prospectiveData["Capacity Building"]);
            this.DevelopmentStrat = Object.entries(prospectiveData["Development Strategy"]);

            this.extractedObjects = this.extractObjectsData(this.Availability);
            if (this.extractedObjects.length > 0) {
                this.displayTopTen(this.extractedObjects, 'chartContainer1');
            }

            this.extractedObjects2 = this.extractObjectsData(this.Readiness);
            if (this.extractedObjects2.length > 0) {
                this.displayTopTen(this.extractedObjects2, 'chartContainer2');
            }

            this.extractedObjects3 = this.extractObjectsData(this.CapacityBuilding);
            if (this.extractedObjects3.length > 0) {
                this.displayTopTen(this.extractedObjects3, 'chartContainer3');
            }

            this.extractedObjects4 = this.extractObjectsData(this.DevelopmentStrat);
            if (this.extractedObjects4.length > 0) {
                this.displayTopTen(this.extractedObjects4, 'chartContainer4');
            }
        });
    }



    extractObjectsData(entries: any[]): any[] {
        const extractedObjects: any[] = [];

        entries.forEach((arr: any) => {
            const category = arr[0];
            const innerArray = arr[1];
            const firstObject = innerArray[0];
            const lastObject = innerArray[innerArray.length - 1];

            const matchingObjects = innerArray.filter((obj: any) => this.mySelections.includes(obj.country_id));

            const combinedObjects = [firstObject, lastObject, ...matchingObjects];

            combinedObjects.sort((a, b) => b.score - a.score);

            extractedObjects.push({ categoryName: category, data: combinedObjects });
        });
        return extractedObjects;
    }

    displayTopTen(data: any[], containerId: string) {
        am4core.useTheme(am4themes_animated);
        this.newDataArray = data.map((obj: any) => obj.data);
        const apiResponse = this.newDataArray;

        // Iterate over each category in the API response
        for (let i = 0; i < apiResponse.length; i++) {
            const category = apiResponse[i];
            const divId = `${containerId}-${i}`;

            // Display ultimate_field and taxonomy_name above the chart
            const categoryInfoDiv = document.createElement('div');
            categoryInfoDiv.style.textAlign = 'center';
            categoryInfoDiv.style.marginBottom = '10px';
            categoryInfoDiv.innerHTML = `<b>${category[0]?.ultimate_field}</b>&nbsp;&nbsp;&nbsp;&nbsp;<b>${category[0]?.taxonomy_name}</b> `;
            const chartContainer: any = document.getElementById(containerId); //imp
            chartContainer.appendChild(categoryInfoDiv);

            const chartDiv = document.createElement('div');
            chartDiv.setAttribute('id', divId);
            chartDiv.style.width = '400px';
            chartDiv.style.height = '300px';
            chartContainer.appendChild(chartDiv);

            // Create the chart inside the corresponding div
            let chart = am4core.create(divId, am4charts.XYChart);
            chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

            chart.data = category;

            let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.renderer.grid.template.location = 0;
            categoryAxis.dataFields.category = "country_name";
            categoryAxis.renderer.minGridDistance = 30;
            categoryAxis.fontSize = 11;
            categoryAxis.renderer.labels.template.dy = 5;

            let image = new am4core.Image();
            image.horizontalCenter = "middle";
            image.width = 12;
            image.height = 12;
            image.verticalCenter = "middle";
            image.adapter.add("href", (href, target: any) => {
                let category = target.dataItem.category;
                if (category) {
                    return "https://www.amcharts.com/wp-content/uploads/flags/" + category.split(" ").join("-").toLowerCase() + ".svg";
                }
                return href;
            })
            categoryAxis.dataItems.template.bullet = image;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.min = 0;
            valueAxis.renderer.minGridDistance = 35;
            valueAxis.renderer.baseGrid.disabled = true;


            let series = chart.series.push(new am4charts.ColumnSeries());
            series.dataFields.categoryX = "country_name";
            series.dataFields.valueY = "score";
            series.columns.template.tooltipText = "{valueY.value}";
            series.columns.template.tooltipY = 0;
            series.columns.template.strokeOpacity = 0;
            series.columns.template.width = am4core.percent(22);

            // as by default columns of the same series are of the same color, we add adapter which takes colors from chart.colors color set
            series.columns.template.adapter.add("fill", function (fill, target: any) {
                return chart.colors.getIndex(target.dataItem.index);
            });
        }

    }


    BarGraph(categoryName: string, data: any[], id: any) {

        if (id === 'present-chart-container') {
            this.dom = document.getElementById('present-chart-container');

        } else if (id === 'prospective-chart-container') {
            this.dom = document.getElementById('prospective-chart-container');
        }

        if (!this.dom) {
            console.error('Chart container element not found.');
            return;
        }

        const chartContainer = document.createElement('div');
        chartContainer.style.width = '70%';
        chartContainer.style.height = '300px';
        this.dom.appendChild(chartContainer);

        const myChart = echarts.init(chartContainer, {
            renderer: 'canvas',
            useDirtyRect: false
        });

        const ultimateNames = data.map((item) => item.ultimate_name);
        const ultimateNamesSet = Array.from(new Set(ultimateNames)); // Get unique ultimate names


        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: [categoryName]
            },
            xAxis: [
                {
                    type: 'category',
                    data: ultimateNamesSet,
                    axisPointer: {
                        type: 'shadow'
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '',
                    min: 0,
                    max: 100,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            series: ultimateNamesSet.map((name) => ({
                name: name,
                type: 'bar',
                barWidth: '12%', // Adjust the bar width here (e.g., '40%')
                data: data
                    .filter((item) => item.ultimate_name === name)
                    .map((item) => Number(item.score))
            }))
        };

        //custom graphic to display category names
        myChart.setOption(option);
        myChart.setOption({
            graphic: [
                {
                    type: 'text',
                    left: 'center',
                    top: 20, // Adjust the top position as needed
                    style: {
                        text: categoryName,
                        textAlign: 'center',
                        fill: '#000',
                        fontWeight: 'bold'
                    }
                }
            ]
        });


        window.addEventListener('resize', () => {
            // myChart.resize();
        });
    }



    BarGraphData(governanceId: any) {

        let data = {
            countries: this.countrySelected,
            governance_id: governanceId
        };

        this.comparativeServices.getChartData(data).subscribe(res => {

            const developmentTypes: [string, any][] = Object.entries(res);

            this.developmentName = developmentTypes.map(([name]) => name);
            this.developmentType = developmentTypes.map(([, type]) => type);

            // Clear the data arrays before populating them with new data
            this.presentType = [];
            this.prospectiveType = [];

            for (let i = 0; i < this.developmentType.length; i++) {
                const type = i === 0 ? this.presentType : this.prospectiveType;
                const data = this.developmentType[i];
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (key !== '[[Prototype]]') {
                            type.push({ categoryName: key, data: data[key] });
                        }
                    }
                }
            }

            this.presentType.forEach((category: any) => {
                this.BarGraph(category.categoryName, category.data, 'present-chart-container');
            });

            this.prospectiveType.forEach((category: any) => {
                this.BarGraph(category.categoryName, category.data, 'prospective-chart-container');
            });


        })

    }


    comparativeOverViewData(governanceId: any) {

        let data = {
            countries: this.countrySelected,
            governance_id: governanceId
        }
        this.comparativeServices.getComparativeOverview(data).subscribe(res => {

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

        })

    }


    toggle(num: number) {
        this.isValue = num;
        this.BarGraphData(this.governance_id)
        this.createRadarChart(this.governance_id);
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
            this.toppings.setValue(this.mySelections);
        }
        this.getTopTenData(this.governance_id)
        this.BarGraphData(this.governance_id);
        this.createRadarChart(this.governance_id);
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


    createRadarChart(governanceId: any) {
        let data = {
            countries: this.countrySelected,
            developmentId: this.isValue,
            governance_id: governanceId
        };

        this.comparativeServices.getChartData(data).subscribe(res => {

            let response = Object.entries(res);
            const radarData: any = [];

            response.forEach((element: any, index: any) => {
                this.taxonomyData = Object.entries(element[1]);

                this.taxonomyData.forEach((element: any, index: any) => {
                    radarData.push(element[0])
                });

            });

            // Update the indicator names dynamically based on the response
            const indicatorNames = radarData;
            this.option.radar.indicator = this.generateIndicatorData(indicatorNames);

            // Update the series data with the dynamically generated radar data
            this.option.series[0].data[0].name = 'Allocated Budget';
            this.option.series[0].data[1].name = 'Actual Spending';

            // Set the updated chart option
            this.chart2.setOption(this.option);
        });

        // Create the chart instance
        this.chart2 = echarts.init(this.radarChartContainer.nativeElement);

        // Define the initial chart option
        this.option = {
            legend: {
                data: []
            },
            radar: {
                indicator: []
            },
            series: [
                {
                    name: 'Budget vs spending',
                    type: 'radar',
                    data: [
                        {
                            value: [38000, 30000, 40000, 50000, 45000],
                            name: 'Allocated Budget'
                        },
                        {
                            value: [45000, 32000, 51000, 40000, 32000],
                            name: 'Actual Spending'
                        }
                    ]
                }
            ]
        };

        // Set the initial chart option
        this.chart2.setOption(this.option);
    }


    generateIndicatorData(indicatorNames: string[]) {
        return indicatorNames.map(name => ({ name: name, max: 60000 }));
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

    createNetworkChart() {

        // Create chart
        var chart = am4core.create("networkChart", am4plugins_forceDirected.ForceDirectedTree);

        // Create series
        var series = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

        // Set data
        series.data = [{
            "name": "Digital Health",
            "children": [{
                "name": "Present Development",
                "value": 100
            }, {
                "name": "Prospective Development",
                "value": 100
            }]
        }];

        // Set up data fields
        series.dataFields.value = "value";
        series.dataFields.name = "name";
        series.dataFields.children = "children";



        // Add labels
        series.nodes.template.label.text = "{name}";
        series.fontSize = 10;
        series.minRadius = 15;
        series.maxRadius = 40;

        series.centerStrength = 0.5;
    }

    ngOnDestroy() {
        console.log('OnDestroy executed');
        am4core.disposeAllCharts();
    }
}






