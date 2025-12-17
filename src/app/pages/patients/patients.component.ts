import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { Patient } from '../../interfaces/patient';
import { PatientsService } from '../../services/patients.service';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-patients',
  imports: [CommonModule, AsyncPipe, RouterLink, MatInputModule, MatIconModule, MatDividerModule, MatFormFieldModule, TranslateModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  patients$!: Observable<Patient[]>;
  patientService = inject(PatientsService);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.patients$ = this.patientService.getPatients();
  }

  searchByKeyword(searchKeyword: string) {
    this.patients$ =
      this.patientService.getPatientBySearchKeyword(searchKeyword);
  }

  deletePatient(id: number){
    this.patientService.deletePatientById(id);
    this.router.navigate(['patients']);
  }

}
