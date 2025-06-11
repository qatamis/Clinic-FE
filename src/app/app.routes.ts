import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountComponent } from './pages/account/account.component';
import { authGuard } from './guards/auth.guard';
import { PatientsComponent } from './pages/patients/patients.component';
import { PatientAddComponent } from './pages/patients/patient-add/patient-add.component';
import { PatientEditComponent } from './pages/patients/patient-edit/patient-edit.component';
import { PatientVisitsComponent } from './pages/patients/patient-visits/patient-visits.component';
import { PatientVisitsAddComponent } from './pages/patients/patient-visits-add/patient-visits-add.component';
import { PatientVisitViewComponent } from './pages/patients/patient-visit-view/patient-visit-view.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'patients',
        component: PatientsComponent,
    },
    {
        path: 'patients/new',
        component: PatientAddComponent,
    },
    {
        path: 'patients/edit/:id',
        component: PatientEditComponent,
    },
    {
        path: 'patient-visits/:id',
        component: PatientVisitsComponent,
    },
    {
        path: 'patient-visits/add/:id',
        component: PatientVisitsAddComponent,
    },
    {
        path: 'patient-visits/view/:id',
        component: PatientVisitViewComponent,
    },
    {
        path:"login",
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,
    },
    {
        path: 'account/:id',
        component: AccountComponent,
        canActivate: [authGuard]
    },
];
