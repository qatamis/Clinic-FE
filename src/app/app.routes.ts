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
import { PatientExamsComponent } from './pages/patients/patient-exams/patient-exams.component';
import { PatientExamAddComponent } from './pages/patients/patient-exam-add/patient-exam-add.component';
import { PatientExamEditComponent } from './pages/patients/patient-exam-edit/patient-exam-edit.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import { DoctorAddComponent } from './pages/doctors/doctor-add/doctor-add.component';
import { DoctorEditComponent } from './pages/doctors/doctor-edit/doctor-edit.component';
import { InsuranceCompaniesComponent } from './pages/insurance-companies/insurance-companies.component';
import { InsuranceCompanyAddComponent } from './pages/insurance-companies/insurance-company-add/insurance-company-add.component';
import { InsuranceCompanyEditComponent } from './pages/insurance-companies/insurance-company-edit/insurance-company-edit.component';
import { InsuranceReportsComponent } from './pages/insurance-reports/insurance-reports.component';
import { AppointmentsComponent } from './pages/appointments/appointments.component';
import { AppointmentAddComponent } from './pages/appointments/appointment-add/appointment-add.component';
import { AppointmentEditComponent } from './pages/appointments/appointment-edit/appointment-edit.component';
import { AppointmentViewComponent } from './pages/appointments/appointment-view/appointment-view.component';

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
        path: 'patient-exams/:id',
        component: PatientExamsComponent,
    },
    {
        path: 'patient-exams/add/:id',
        component: PatientExamAddComponent,
    },
    {
        path: 'patient-exams/edit/:id',
        component: PatientExamEditComponent,
    },
    {
        path: 'doctors',
        component: DoctorsComponent,
    },
    {
        path: 'doctors/new',
        component: DoctorAddComponent,
    },
    {
        path: 'doctors/edit/:id',
        component: DoctorEditComponent,
    },
    {
        path: 'insurance-companies',
        component: InsuranceCompaniesComponent,
    },
    {
        path: 'insurance-companies/new',
        component: InsuranceCompanyAddComponent,
    },
    {
        path: 'insurance-companies/edit/:id',
        component: InsuranceCompanyEditComponent,
    },
    {
        path: 'insurance-reports',
        component: InsuranceReportsComponent,
    },
    {
        path: 'appointments',
        component: AppointmentsComponent,
    },
    {
        path: 'appointments/new',
        component: AppointmentAddComponent,
    },
    {
        path: 'appointments/edit/:id',
        component: AppointmentEditComponent,
    },
    {
        path: 'appointments/view/:id',
        component: AppointmentViewComponent,
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
