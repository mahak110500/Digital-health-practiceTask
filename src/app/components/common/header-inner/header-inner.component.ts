import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from 'src/app/services/utilities.service';

@Component({
	selector: 'app-header-inner',
	templateUrl: './header-inner.component.html',
	styleUrls: ['./header-inner.component.css']
})
export class HeaderInnerComponent implements OnInit {

	showHeaderMenu: boolean = true;
    isValue: number = 0;
	governance_id: any;

    constructor(private utilities: UtilitiesService){}


	ngOnInit() {

	}

	toggle(num: number) {
		console.log(num);
		
        this.isValue = num;
        this.governance_id = num;
        localStorage.setItem('governance_id', JSON.stringify(num));

        this.utilities.governanceTypeSource.next(num);

    }
}
