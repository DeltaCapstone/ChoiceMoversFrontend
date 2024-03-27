import { Routes } from '@angular/router';
import { DashboardComponent } from "./content/dashboard/dashboard.component";
import { HomeComponent } from "./content/home/home.component";
import { ScheduleComponent } from "./content/dashboard/schedule/schedule.component";
import { EmployeesComponent } from "./content/dashboard/employees/employees.component";
import { StatisticsComponent } from "./content/dashboard/statistics/statistics.component";
import { SettingsComponent } from "./content/dashboard/settings/settings.component";
import { CustomerHomeComponent } from './content/home/customer-home/customer-home/customer-home.component';
import { MovingComponent } from './content/home/moving/moving/moving.component';
import { CleanOutComponent } from './content/home/clean-out/clean-out/clean-out.component';
import { ContactComponent } from './content/home/contact/contact/contact.component';
import { PackingComponent } from './content/home/packing/packing/packing.component';
import { QuoteComponent } from './content/home/quote/quote/quote.component';
import { StorageComponent } from './content/home/storage/storage/storage.component';
import { MovePlannerComponent } from './content/home/move-planner/move-planner/move-planner.component';
import { ProfileComponent } from './shared/components/profile/profile.component';
import { LoginComponent } from './shared/components/login/login.component';
import { dashboardGuard } from './shared/guards/dashboard.guard';
import { EmployeeInfoComponent } from './shared/components/employee-info/employee-info.component';
import { JobInfoComponent } from './shared/components/job-info/job-info.component';
import { CustomerSummaryComponent } from './content/home/customer-summary/customer-summary.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home/customer-home', pathMatch: 'full' },
    { path: 'home', redirectTo: 'home/customer-home', pathMatch: 'full' },
    { path: 'dashboard', redirectTo: 'dashboard/schedule', pathMatch: 'full' },

    {
        path: 'home', component: HomeComponent, children: [
            { path: 'customer-home', component: CustomerHomeComponent },
            { path: 'clean-out', component: CleanOutComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'moving', component: MovingComponent },
            { path: 'move-planner', component: MovePlannerComponent },
            { path: 'packing', component: PackingComponent },
            { path: 'quote', component: QuoteComponent },
            { path: 'storage', component: StorageComponent },
            { path: 'customer-summary', component: CustomerSummaryComponent },
        ]
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [dashboardGuard], children: [
            { path: 'schedule', component: ScheduleComponent },
            { path: 'schedule/job/:jobId', component: JobInfoComponent },
            { path: 'employees', component: EmployeesComponent },
            { path: 'employees/employee/:userName', component: EmployeeInfoComponent },
            { path: 'statistics', component: StatisticsComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'profile', component: ProfileComponent },
        ]
    },
    { path: 'login', pathMatch: 'full', component: LoginComponent },
];
