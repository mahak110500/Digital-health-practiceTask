import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-present-development',
	templateUrl: './present-development.component.html',
	styleUrls: ['./present-development.component.css']
})
export class PresentDevelopmentComponent implements OnInit {

	ngOnInit(): void {

	}

	getPresentData(governance_id:any){

		let data ={
			countries: "14",
			development_id: 1,
			governance_id:governance_id
		}

	}

}
