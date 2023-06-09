import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  healthActive = false;
  digitalHealthActive = false;


  toggleHealth() {
    this.healthActive = !this.healthActive;
  }


  toggleDigitalHealth() {
    this.digitalHealthActive = !this.digitalHealthActive;
  }

}
