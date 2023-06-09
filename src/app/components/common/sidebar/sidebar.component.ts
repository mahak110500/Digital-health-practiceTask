import { indexOf } from '@amcharts/amcharts5/.internal/core/util/Array';
import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
	activeTabs: any = [1];
	expanded: boolean = false;
	public ngOnInit() {
		$(document).ready(function () {
			$('.toggleMenubar').on('click', function () {
				$('body')
					.toggleClass('site-menubar-unfold')
					.toggleClass('site-menubar-fold');
			});
		});
		$(function () {
			$('.vertical-tree ul').hide();
			$('.vertical-tree>ul').show();
			$('.vertical-tree ul.active ').show();
			$('.vertical-tree li').on('click', function (e) {
				var children = $(this).find('> ul');
				if (children.is(':visible'))
					children.hide('fast').removeClass('active');
				else children.show('fast').addClass('active');
				e.stopPropagation();
			});
		});
	}

	isValue: number = 0;

	toggle(num: number) {
		// console.log(num);

		if (num == 1) {
			this.expanded = this.expanded ? false : true;
			this.activeTabs = [];
		}

		if (!this.activeTabs.includes(num)) {
			this.activeTabs.push(num);
		}

		if (num == 3) {
			this.activeTabs = [];
			this.activeTabs = [1, 3];
		}

		if (num == 4 || num == 5 || num == 6) {
			this.activeTabs.splice(this.activeTabs.indexOf(3), 1);
		}

		if (num == 5) {
			this.activeTabs.splice(this.activeTabs.indexOf(6), 1);
		}

		if (num == 6) {
			this.activeTabs.splice(this.activeTabs.indexOf(5), 1);
		}

		if (num == 5 || (num == 6 && !this.activeTabs.includes(4))) {
			this.activeTabs.push(4);
		}

		if (num == 7) {
			this.activeTabs = [];
			this.activeTabs = [1, 7];
		}

		this.isValue = num;
	}
}
