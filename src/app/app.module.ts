import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewDataComponent } from './pages/view-data/view-data.component';
import { HeaderComponent } from './components/common/header/header.component';
import { HeaderInnerComponent } from './components/common/header-inner/header-inner.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';


import { HomePageComponent } from './pages/home-page/home-page.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { PieChartCardComponent } from './pages/pie-chart-card/pie-chart-card.component';


@NgModule({
  declarations: [
    AppComponent,
    ViewDataComponent,
    HeaderComponent,
    HeaderInnerComponent,
    LayoutComponent,
    SidebarComponent,
    HomePageComponent,
    CountriesComponent,
    PieChartCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatIconModule,
    MatSidenavModule,
    MatDialogModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
