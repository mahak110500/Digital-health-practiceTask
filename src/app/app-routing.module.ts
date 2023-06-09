import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/common/layout/layout.component';
import { ViewDataComponent } from './pages/view-data/view-data.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { CountriesComponent } from './pages/countries/countries.component';

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
