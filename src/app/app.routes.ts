import { Routes } from '@angular/router';
import { ScheduleComponent } from '../components/schedule/schedule.component';
import { EmployeesComponent } from '../components/employees/employees.component';

export const routes: Routes = [
    {path: 'schedule', component: ScheduleComponent},
    {path: 'employees', component: EmployeesComponent}, 
];
