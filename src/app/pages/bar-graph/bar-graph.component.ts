import { Component, Input, OnInit } from '@angular/core';
import * as echarts from 'echarts';


@Component({
	selector: 'app-bar-graph',
	templateUrl: './bar-graph.component.html',
	styleUrls: ['./bar-graph.component.css']
})
export class BarGraphComponent implements OnInit {
	@Input() chartId!: string;
	@Input() categoryName!: string;
	@Input() data!: any[];

	dom: any;
	chartContainer: any;

	ngOnInit() {
		// this.renderBarGraph();
	}

	renderBarGraph(categoryName: string, data: any[], containerId: string) {
		console.log('renderBarGraph() called')
		
		if (!containerId) {
			console.error('Container ID is missing.');
			return;
		}

		this.dom = document.getElementById(containerId);

		if (!this.dom) {
			console.error('Chart container element not found.');
			return;
		}


		this.chartContainer = document.createElement('div');
		this.chartContainer.style.width = '70%';
		this.chartContainer.style.height = '300px';
		this.dom.appendChild(this.chartContainer);

		const myChart = echarts.init(this.chartContainer, {
			renderer: 'canvas',
			useDirtyRect: false
		});

		const ultimateNames = Array.from(new Set(this.data.map((item) => item.ultimate_name)));
		const countries = Array.from(new Set(this.data.map((item) => item.countries_name)));

		const selectedCountry1 = countries[0];
		const selectedCountry2 = countries[1];
		const firstCountryArray = this.data.filter(obj => obj.countries_name === selectedCountry1);
		const secondCountryArray = this.data.filter(obj => obj.countries_name === selectedCountry2);

		const option =
		{
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				// data: [categoryName]
			},
			xAxis: [
				{
					type: 'category',
					data: ultimateNames,
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
			series: [
				{
					name: countries[0],
					type: 'bar',
					barWidth: '12%',
					data: firstCountryArray.map((item) => ({
						name: item.ultimate_name,
						value: item.score,
						itemStyle: {
							color: item.countries_name === firstCountryArray[0].countries_name ? '#884dff' : ' #00e6b8'
						}
					}))
				},
				{
					name: countries[1],
					type: 'bar',
					barWidth: '12%',
					data: secondCountryArray.map((item) => ({
						name: item.ultimate_name,
						value: item.score,
						itemStyle: {
							color: item.countries_name === firstCountryArray[0].countries_name ? '#884dff' : ' #00e6b8'
						}
					}))
				}
			]
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
						text: 'IT Governance',
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











}
