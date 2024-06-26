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
import { DashboardGuard } from './shared/guards/dashboard.guard';
import { EmployeeInfoComponent } from './shared/components/employee-info/employee-info.component';
import { JobComponent } from './shared/components/job/job.component';
import { JobInfoComponent } from './shared/components/job/job-info/job-info.component';
import { JobWorkersComponent } from './shared/components/job/job-workers/job-workers.component';
import { jobGuard } from './shared/guards/job.guard';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { inject } from '@angular/core';
import { JobContactComponent } from './shared/components/job/job-contact/job-contact.component';
import { CustomerSummaryComponent } from './content/home/customer-summary/customer-summary.component';
import { CustomerInfoComponent } from './shared/components/customer-info/customer-info.component';
import { movePlannerGuard } from './shared/guards/move-planner.guard';
import { CustomerProfileComponent } from './content/home/customer-profile/customer-profile.component';

import { JobCompletionComponent } from './content/home/job-completion/job-completion.component';

import { EmployeeSignupComponent } from './shared/components/employee-signup/employee-signup.component';


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
            { path: 'move-planner', component: MovePlannerComponent, canActivate: [() => inject(movePlannerGuard).canActivate()] },
            { path: 'packing', component: PackingComponent },
            { path: 'quote', component: QuoteComponent },
            { path: 'storage', component: StorageComponent },
            { path: 'customer-summary', component: CustomerSummaryComponent, canActivate: [() => inject(movePlannerGuard).canActivate()] },
            { path: 'customer-signup', component: CustomerInfoComponent },
            { path: 'customer-profile', component: CustomerProfileComponent, canActivate: [() => inject(movePlannerGuard).canActivate()] },
            { path: 'job-completion', component: JobCompletionComponent, canActivate: [() => inject(movePlannerGuard).canActivate()] },
        ]
    },
    {
        path: 'dashboard', component: DashboardComponent, canActivate: [() => inject(DashboardGuard).canActivate()], children: [
            { path: 'schedule', component: ScheduleComponent },
            {
                path: 'schedule/job/:jobId', component: JobComponent, canActivate: [jobGuard], children: [
                    { path: '', redirectTo: 'info', pathMatch: 'full' },
                    { path: 'info', component: JobInfoComponent },
                    { path: 'workers', component: JobWorkersComponent },
                    { path: 'workers/:userName', component: EmployeeInfoComponent },
                    { path: 'contact', component: JobContactComponent },
                ]
            },
            { path: 'employees', component: EmployeesComponent },
            { path: 'employees/employee/:userName', component: EmployeeInfoComponent },
            { path: 'statistics', component: StatisticsComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'profile', component: ProfileComponent },
        ]
    },
    { path: 'login/:type', pathMatch: 'full', component: LoginComponent },
    { path: 'signup/employee/:token', pathMatch: 'full', component: EmployeeSignupComponent },
    { path: '**', component: NotFoundComponent }
];
