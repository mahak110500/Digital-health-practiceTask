import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ViewDataComponent } from './pages/countries-data/view-data/view-data.component';
import { HeaderComponent } from './components/common/header/header.component';
import { HeaderInnerComponent } from './components/common/header-inner/header-inner.component';
import { LayoutComponent } from './components/common/layout/layout.component';
import { SidebarComponent } from './components/common/sidebar/sidebar.component';

import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';



import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from "@angular/material/button-toggle";


import { HomePageComponent } from './pages/home-page/home-page.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { PieChartCardComponent } from './pages/pie-chart-card/pie-chart-card.component';
import { NdhsMapComponent } from './pages/ndhs-map/ndhs-map.component';
import { PresentDevelopmentComponent } from './pages/countries-data/present-development/present-development.component';
import { ProspectiveDevelopmentComponent } from './pages/countries-data/prospective-development/prospective-development.component';
import { ComparativeResultsComponent } from './pages/comparative-results/comparative-results.component';


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
    NdhsMapComponent,
    PresentDevelopmentComponent,
    ProspectiveDevelopmentComponent,
    ComparativeResultsComponent,
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
    MatDialogModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
