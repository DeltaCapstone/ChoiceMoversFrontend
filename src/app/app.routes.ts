import { Routes } from '@angular/router';
import { DashboardComponent } from "./content/dashboard/dashboard.component";
import { HomeComponent } from "./content/home/home.component";
import { ScheduleComponent } from "./content/dashboard/schedule/schedule.component";
import { EmployeesComponent } from "./content/dashboard/employees/employees.component";
import { StatisticsComponent } from "./content/dashboard/statistics/statistics.component";
import { SettingsComponent } from "./content/dashboard/settings/settings.component";


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'dashboard', redirectTo: 'dashboard/schedule', pathMatch: 'full' },
    
    { path: 'home', component: HomeComponent, children: [
        
    ]},
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'schedule', component: ScheduleComponent },
        { path: 'employees', component: EmployeesComponent },
        { path: 'statistics', component: StatisticsComponent },
        { path: 'settings', component: SettingsComponent }, 
    ]},
];
