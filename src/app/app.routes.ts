import { Routes } from '@angular/router';
import { ScheduleComponent } from '../components/schedule/schedule.component';
import { EmployeesComponent } from '../components/employees/employees.component';
import { StatisticsComponent } from '../components/statistics/statistics.component';
import { SettingsComponent } from '../components/settings/settings.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    { path: '', redirectTo: 'schedule', pathMatch: 'full' },
    { path: 'schedule', component: ScheduleComponent },
    { path: 'employees', component: EmployeesComponent },
    { path: 'statistics', component: StatisticsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'home', component: HomeComponent }
];
