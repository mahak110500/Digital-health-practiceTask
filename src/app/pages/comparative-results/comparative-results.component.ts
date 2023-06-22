import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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

interface IDataContext {
    governance_id: string;
    development_id: string;
    ultimate_id: string;
    taxonomy_id: string;
}




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
    developmentStratArray: any = [];
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
    payloadObj: any = {};

    step = 0;
    stepinner = 0;

    setStep(index: number) {
        this.step = index;
    }
    @ViewChild('mySelect') mySelect: ElementRef | any;
    @ViewChild('radarChartContainer', { static: true }) radarChartContainer!: ElementRef;
    @ViewChild('topChart', { static: true }) chartElement!: ElementRef;
    constructor(
        private mapService: CountriesService,
        private utilityService: UtilitiesService,
        private apiService: CommonService,
        private comparativeServices: ComparativeResultService,
        private cdr: ChangeDetectorRef
    ) { }

    ngAfterViewChecked() {
        this.cdr.detectChanges();
    }

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

            this.payloadObj = {
                countries: this.countrySelected,
                governance_id: governanceId
            }

            this.getTopTenData(this.payloadObj)
            this.BarGraphData(this.payloadObj)
            this.comparativeOverViewData(this.payloadObj);
            this.createRadarChart(this.governance_id);
        });

    }

    getTopTenData(data: any) {
        const modifiedPayloadObj = { ... this.payloadObj };

        if (modifiedPayloadObj.hasOwnProperty('governance_id')) {
            modifiedPayloadObj['governanceId'] = modifiedPayloadObj['governance_id'];
            delete modifiedPayloadObj['governance_id'];
        }
        if (modifiedPayloadObj.hasOwnProperty('development_id')) {
            modifiedPayloadObj['developmentId'] = modifiedPayloadObj['development_id'];
            delete modifiedPayloadObj['development_id'];
        }
        if (modifiedPayloadObj.hasOwnProperty('ultimate_id')) {
            modifiedPayloadObj['ultimateId'] = modifiedPayloadObj['ultimate_id'];
            delete modifiedPayloadObj['ultimate_id'];
        }
        if (modifiedPayloadObj.hasOwnProperty('taxonomy_id')) {
            modifiedPayloadObj['taxonomyId'] = modifiedPayloadObj['taxonomy_id'];
            delete modifiedPayloadObj['taxonomy_id'];
        }

        modifiedPayloadObj['year'] = this.selectedYear

        this.comparativeServices.getTopTen(modifiedPayloadObj).subscribe(res => {

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


    BarGraphData(data: any) {
        const modifiedPayload = { ... this.payloadObj };

        if (modifiedPayload.hasOwnProperty('development_id')) {
            modifiedPayload['developmentId'] = modifiedPayload['development_id'];
            delete modifiedPayload['development_id'];
        }
        if (modifiedPayload.hasOwnProperty('ultimate_id')) {
            modifiedPayload['ultimateId'] = modifiedPayload['ultimate_id'];
            delete modifiedPayload['ultimate_id'];
        }
        if (modifiedPayload.hasOwnProperty('taxonomy_id')) {
            modifiedPayload['taxonomyId'] = modifiedPayload['taxonomy_id'];
            delete modifiedPayload['taxonomy_id'];
        }

        this.comparativeServices.getChartData(modifiedPayload).subscribe(res => {

            console.log(res);
            
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

    comparativeOverViewData(data: any) {
        this.comparativeServices.getComparativeOverview(data).subscribe(res => {

            const developmentTypes: [string, any][] = Object.entries(res);

            this.developmentName = developmentTypes.map(([name]) => name);
            this.developmentType = developmentTypes.map(([, type]) => type);

            const availabilityObject: any = {};
            const readinessObject: any = {};
            const capacityBuildingObject: any = {};
            const developmentStrategyObject: any = {};

            developmentTypes.forEach(([key, value]) => {
                switch (key) {
                    case 'Present Development':
                        if (value['Availability']) {
                            Object.assign(availabilityObject, value['Availability']);
                        }
                        if (value['Readiness']) {
                            Object.assign(readinessObject, value['Readiness']);
                        }
                        break;
                    case 'Prospective Development':
                        if (value['Capacity Building']) {
                            Object.assign(capacityBuildingObject, value['Capacity Building']);
                        }
                        if (value['Development Strategy']) {
                            Object.assign(developmentStrategyObject, value['Development Strategy']);

                        }
                        break;
                    default:
                        break;
                }
            });

            this.Availability = Object.entries(availabilityObject);
            this.dataAvailability = this.getNestedEntries(this.Availability);
            this.processDataArray(this.dataAvailability, this.availabilityArray);
            this.availabilityArray = this.mapResponseData(this.availabilityArray);

            this.Readiness = Object.entries(readinessObject);
            this.dataReadiness = this.getNestedEntries(this.Readiness);
            this.processDataArray(this.dataReadiness, this.readinessArray);
            this.readinessArray = this.mapResponseData(this.readinessArray);

            this.CapacityBuilding = Object.entries(capacityBuildingObject);
            this.dataCapacityBuild = this.getNestedEntries(this.CapacityBuilding);
            this.processDataArray(this.dataCapacityBuild, this.capacityBuildArray);
            this.capacityBuildArray = this.mapResponseData(this.capacityBuildArray);

            this.DevelopmentStrat = Object.entries(developmentStrategyObject);
            this.dataDevelopmentStrat = this.getNestedEntries(this.DevelopmentStrat);
            this.processDataArray(this.dataDevelopmentStrat, this.developmentStratArray);
            this.developmentStratArray = this.mapResponseData(this.developmentStratArray);

        })

    }

    mapResponseData(array: any[]): any[] {
        return array.map((arr: any) => {
            const arrayAtIndex1 = arr[1];
            const objectsArray = Object.values(arrayAtIndex1).flat();
            return [arr[0], objectsArray];
        });
    }


    isFirstAvailQuestion(questionName: string, outerIndex: number, innerIndex: number): boolean {
        // Check if the current question is the first occurrence
        for (let i = 0; i < outerIndex; i++) {
            const questions = this.availabilityArray[i][1];
            if (questions.findIndex((val: any) => val.question_name === questionName) !== -1) {
                return false; // Not the first occurrence
            }
        }
        // If it's the first occurrence in the current array, check if it's the first occurrence in the inner array
        return this.availabilityArray[outerIndex][1].findIndex((val: any, index: number) => index < innerIndex && val.question_name === questionName) === -1;
    }

    isFirstReadiQuestion(questionName: string, outerIndex: number, innerIndex: number): boolean {
        for (let i = 0; i < outerIndex; i++) {
            const questions = this.readinessArray[i][1];
            if (questions.findIndex((val: any) => val.question_name === questionName) !== -1) {
                return false;
            }
        }
        return this.readinessArray[outerIndex][1].findIndex((val: any, index: number) => index < innerIndex && val.question_name === questionName) === -1;
    }

    isFirstCapacityQuestion(questionName: string, outerIndex: number, innerIndex: number): boolean {
        for (let i = 0; i < outerIndex; i++) {
            const questions = this.capacityBuildArray[i][1];
            if (questions.findIndex((val: any) => val.question_name === questionName) !== -1) {
                return false;
            }
        }

        return this.capacityBuildArray[outerIndex][1].findIndex((val: any, index: number) => index < innerIndex && val.question_name === questionName) === -1;
    }

    isFirstDevelopmentQuestion(questionName: string, outerIndex: number, innerIndex: number): boolean {
        for (let i = 0; i < outerIndex; i++) {
            const questions = this.developmentStratArray[i][1];
            if (questions.findIndex((val: any) => val.question_name === questionName) !== -1) {
                return false;
            }
        }

        return this.developmentStratArray[outerIndex][1].findIndex((val: any, index: number) => index < innerIndex && val.question_name === questionName) === -1;
    }






    createNetworkChart() {

        am4core.useTheme(am4themes_animated);

        var chart = am4core.create("networkChart", am4plugins_forceDirected.ForceDirectedTree);
        var networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries())

        networkSeries.nodes.template.outerCircle.filters.push(new am4core.DropShadowFilter());
        networkSeries.dataFields.linkWith = "linkWith";
        networkSeries.dataFields.name = "name";
        networkSeries.dataFields.id = "governance_id";
        networkSeries.dataFields.value = "value";
        networkSeries.dataFields.children = "children";
        networkSeries.dataFields.color = "color";
        networkSeries.dataFields.fixed = "fixed";
        networkSeries.nodes.template.propertyFields.x = "x";
        networkSeries.nodes.template.propertyFields.y = "y";
        networkSeries.nodes.template.expandAll = false;

        networkSeries.maxLevels = 2;
        networkSeries.links.template.strength = 1;
        networkSeries.manyBodyStrength = -20;
        networkSeries.centerStrength = 0.4;

        networkSeries.nodes.template.label.text = "{name}"
        networkSeries.fontSize = 10;
        networkSeries.minRadius = 10;
        networkSeries.maxRadius = 24;

        var nodeTemplate = networkSeries.nodes.template;
        nodeTemplate.fillOpacity = 1;
        nodeTemplate.label.hideOversized = true;
        nodeTemplate.label.truncate = true;

        var linkTemplate = networkSeries.links.template;
        linkTemplate.strokeWidth = 2;
        linkTemplate.distance = 1;

        nodeTemplate.events.on("out", function (event) {
            var dataItem = event.target.dataItem;
            dataItem.childLinks.each(function (link) {
                link.isHover = false;
            })
        })

        networkSeries.events.on("inited", function () {
            networkSeries.animate({
                property: "velocityDecay",
                to: 0.7
            }, 3000);
        });

        networkSeries.data = [
            {
                "name": "Health & IT",
                "value": 100,
                "color": "#22bdad",
                "fixed": true,
                "governance_id": 1,
                x: am4core.percent(50),
                y: am4core.percent(20),
                "children": [
                    {
                        "name": "Present \n Development",
                        "value": 60,
                        "governance_id": 1,
                        "development_id": 1,
                        "color": "#22bdad",
                        "fixed": true,
                        x: am4core.percent(30),
                        y: am4core.percent(40),
                        "children": [
                            {
                                "name": "Availability",
                                "value": 40,
                                "governance_id": 1,
                                "development_id": 1,
                                "ultimate_id": 2,
                                "color": "#22bdad",
                                "fixed": true,
                                x: am4core.percent(15),
                                y: am4core.percent(50),
                                "children": [
                                    {
                                        "name": "AI Workforce/Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 2,
                                        "taxonomy_id": 5,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(3),
                                        y: am4core.percent(70),
                                    },
                                    {
                                        "name": "Healthcare Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 2,
                                        "taxonomy_id": 1,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(8),
                                        y: am4core.percent(70),
                                    },
                                    {
                                        "name": "Healthcare workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 2,
                                        "taxonomy_id": 4,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(12),
                                        y: am4core.percent(75),
                                    },
                                    {
                                        "name": "IT workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 2,
                                        "taxonomy_id": 3,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(16),
                                        y: am4core.percent(70),
                                    },
                                    {
                                        "name": "IT Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 2,
                                        "taxonomy_id": 2,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(21),
                                        y: am4core.percent(70),
                                    }
                                ]
                            },
                            {
                                "name": "Readiness",
                                "value": 40,
                                "governance_id": 1,
                                "development_id": 1,
                                "ultimate_id": 1,
                                "color": "#22bdad",
                                "fixed": true,
                                x: am4core.percent(43),
                                y: am4core.percent(53),
                                "children": [
                                    {
                                        "name": "AI Workforce/Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 1,
                                        "taxonomy_id": 5,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(35),
                                        y: am4core.percent(70),
                                    },
                                    {
                                        "name": "Healthcare Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 1,
                                        "taxonomy_id": 1,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(40),
                                        y: am4core.percent(70),
                                    },
                                    {
                                        "name": "Healthcare workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 1,
                                        "taxonomy_id": 4,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(43),
                                        y: am4core.percent(76),
                                    },
                                    {
                                        "name": "IT workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 1,
                                        "taxonomy_id": 3,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(47),
                                        y: am4core.percent(70),
                                    },
                                    {
                                        "name": "IT Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 1,
                                        "ultimate_id": 1,
                                        "taxonomy_id": 2,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(52),
                                        y: am4core.percent(70),
                                    }
                                ]
                            }

                        ]
                    },
                    {
                        "name": "Prospective \n Development",
                        "color": "#22bdad",
                        "value": 60,
                        "governance_id": 1,
                        "development_id": 2,
                        "fixed": true,
                        x: am4core.percent(70),
                        y: am4core.percent(40),
                        "children": [
                            {
                                "name": "Capacity \n Building",
                                "value": 40,
                                "governance_id": 1,
                                "development_id": 2,
                                "ultimate_id": 4,
                                "color": "#22bdad",
                                "fixed": true,
                                x: am4core.percent(62),
                                y: am4core.percent(60),
                                "children": [
                                    {
                                        "name": "AI Workforce/Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 4,
                                        "taxonomy_id": 5,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(54),
                                        y: am4core.percent(78),
                                    },
                                    {
                                        "name": "Healthcare Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 4,
                                        "taxonomy_id": 1,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(59),
                                        y: am4core.percent(78),
                                    },
                                    {
                                        "name": "Healthcare workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 4,
                                        "taxonomy_id": 4,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(63),
                                        y: am4core.percent(82),
                                    },
                                    {
                                        "name": "IT workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 4,
                                        "taxonomy_id": 3,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(67),
                                        y: am4core.percent(78),

                                    },
                                    {
                                        "name": "IT Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 4,
                                        "taxonomy_id": 2,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(72),
                                        y: am4core.percent(78),

                                    }

                                ]
                            },
                            {
                                "name": "Development \n Strategy",
                                "value": 40,
                                "governance_id": 1,
                                "development_id": 2,
                                "ultimate_id": 3,
                                "color": "#22bdad",
                                "fixed": true,
                                x: am4core.percent(87),
                                y: am4core.percent(60),
                                "children": [
                                    {
                                        "name": "AI Workforce/Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 3,
                                        "taxonomy_id": 5,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(80),
                                        y: am4core.percent(78),
                                    },
                                    {
                                        "name": "Healthcare Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 3,
                                        "taxonomy_id": 1,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(85),
                                        y: am4core.percent(78),
                                    },
                                    {
                                        "name": "Healthcare workforce & Infrastructure",
                                        "value": 2,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 3,
                                        "taxonomy_id": 4,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(89),
                                        y: am4core.percent(83),
                                    },
                                    {
                                        "name": "IT workforce & Infrastructure",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 3,
                                        "taxonomy_id": 3,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(91.8),
                                        y: am4core.percent(78),
                                    },
                                    {
                                        "name": "IT Governance",
                                        "value": 1,
                                        "governance_id": 1,
                                        "development_id": 2,
                                        "ultimate_id": 3,
                                        "taxonomy_id": 2,
                                        "color": "#22bdad",
                                        "fixed": true,
                                        x: am4core.percent(97),
                                        y: am4core.percent(78),
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];


        nodeTemplate.events.on("hit", (event: any) => {
            var dataItem = event.target.dataItem;
            var dataContext = dataItem.dataContext as IDataContext;

            if (dataContext.governance_id) {
                this.payloadObj
            }
            if (dataContext.development_id) {
                this.payloadObj['development_id'] = dataContext.development_id;
            }
            if (dataContext.ultimate_id) {
                this.payloadObj['ultimate_id'] = dataContext.ultimate_id;
            }
            if (dataContext.taxonomy_id) {
                this.payloadObj['taxonomy_id'] = dataContext.taxonomy_id;
            }

            this.comparativeOverViewData(this.payloadObj);
            this.BarGraphData(this.payloadObj);
            this.getTopTenData(this.payloadObj);




            // var governanceId = dataContext.governance_id;
            // var developmentId = dataContext.development_id;
            // var ultimateId = dataContext.ultimate_id;
            // var taxonomyId = dataContext.taxonomy_id;


            // this.getTopTenData(governanceId, developmentId, ultimateId, taxonomyId);
            // this.BarGraph(governanceId, developmentId, ultimateId, taxonomyId);
        });


    }


    // createNetworkChart(data: any) {

    //     am4core.useTheme(am4themes_animated);

    //     let chart = am4core.create("networkChart", am4plugins_forceDirected.ForceDirectedTree);
    //     chart.legend = new am4charts.Legend();

    //     let networkSeries = chart.series.push(new am4plugins_forceDirected.ForceDirectedSeries());

    //     // Disable drag functionality
    //     networkSeries.nodes.template.draggable = false;
    //     networkSeries.nodes.template.inert = true;

    //     // Disable rotation
    //     networkSeries.nodes.template.rotation = 0;

    //     networkSeries.data = data
    //     // networkSeries.data = [
    //     //     {
    //     //         name: 'Health & It',
    //     //         fixed: true,
    //     //         children: [
    //     //             {
    //     //                 name: 'Present Development',
    //     //                 fixed: true,

    //     //                 children: [
    //     //                     {
    //     //                         name: 'Availability',
    //     //                         fixed: true,
    //     //                         children: [
    //     //                             {
    //     //                                 name: 'It Governance',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'AI Workforce & Infrastructure',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'Health Governance',
    //     //                                 fixed: true
    //     //                             }
    //     //                         ]
    //     //                     },
    //     //                     {
    //     //                         name: 'Readiness',
    //     //                         fixed: true,

    //     //                         children: [
    //     //                             {
    //     //                                 name: 'It Governance',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'AI Workforce & Infrastructure',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'Health Governance',
    //     //                                 fixed: true
    //     //                             }
    //     //                         ]
    //     //                     }
    //     //                 ]
    //     //             },
    //     //             {
    //     //                 name: 'Prospective Development',
    //     //                 fixed: true,
    //     //                 children: [
    //     //                     {
    //     //                         name: 'Capacity Building',
    //     //                         fixed: true,
    //     //                         children: [
    //     //                             {
    //     //                                 name: 'It Governance',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'AI Workforce & Infrastructure',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'Health Governance',
    //     //                                 fixed: true
    //     //                             }
    //     //                         ]
    //     //                     },
    //     //                     {
    //     //                         name: 'Development Startegy',
    //     //                         fixed: true,

    //     //                         children: [
    //     //                             {
    //     //                                 name: 'It Governance',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'AI Workforce & Infrastructure',
    //     //                                 fixed: true
    //     //                             },
    //     //                             {
    //     //                                 name: 'Health Governance',
    //     //                                 fixed: true
    //     //                             }
    //     //                         ]
    //     //                     }
    //     //                 ]
    //     //             }
    //     //         ]
    //     //     }
    //     // ];

    //     networkSeries.dataFields.linkWith = "linkWith";
    //     networkSeries.dataFields.name = "name";
    //     networkSeries.dataFields.id = "name";
    //     networkSeries.dataFields.value = "value";
    //     networkSeries.dataFields.children = "children";


    //     // Set node properties
    //     let nodeTemplate = networkSeries.nodes.template;
    //     nodeTemplate.tooltipText = "{name}";
    //     networkSeries.nodes.template.fillOpacity = 1;
    //     networkSeries.nodes.template.label.text = "{name}"
    //     networkSeries.fontSize = 8;
    //     networkSeries.maxLevels = 2;
    //     networkSeries.nodes.template.label.hideOversized = true;
    //     networkSeries.nodes.template.label.truncate = true;




    //     // Configure forces to create a tree-like structure
    //     networkSeries.minRadius = 30;
    //     networkSeries.maxRadius = 50;
    //     networkSeries.links.template.distance = 2;

    //     chart.zoomable = false; // Disable chart zooming


    // }



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

                    localStorage.removeItem('selected_country');
                    localStorage.setItem('selected_country', this.countrySelected);
                    this.mySelect.close();

                }
            }
            this.toppings.setValue(this.mySelections);
        }
        this.getTopTenData(this.payloadObj)
        this.BarGraphData(this.payloadObj);
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


    ngOnDestroy() {
        console.log('OnDestroy executed');
        am4core.disposeAllCharts();
    }
}






