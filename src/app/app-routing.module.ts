import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/common/layout/layout.component';
import { ViewDataComponent } from './pages/countries-data/view-data/view-data.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CountriesComponent } from './pages/countries/countries.component';
import { NdhsMapComponent } from './pages/ndhs-map/ndhs-map.component';
import { PresentDevelopmentComponent } from './pages/countries-data/present-development/present-development.component';
import { ProspectiveDevelopmentComponent } from './pages/countries-data/prospective-development/prospective-development.component';

const routes: Routes = [

	{
        path: '',
        redirectTo: '/home',
        pathMatch: 'full',
    },
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: 'ndhs-map',
                component: NdhsMapComponent,
                data: { title: 'NDHS-Map' },
            },
            {
                path: 'home',
                component: HomePageComponent,
                data: { title: 'home' },
            },
			{
                path: 'view-data',
                component: ViewDataComponent,
                data: { title: 'View-Data' },
            },
            {
                path: 'present-development',
                component: PresentDevelopmentComponent,
                data: { title: 'Present-Development' },
            },
            {
                path: 'prospective-development',
                component: ProspectiveDevelopmentComponent,
                data: { title: 'Prospective-Development' },
            },
			{
                path: 'countries',
                component: CountriesComponent,
                data: { title: 'countries' },
            },
        ],
    },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
