import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PatientVisits } from '../../../interfaces/patient-visits';
import { PatientVisitsService } from '../../../services/patient-visits.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-visit-view',
  imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterLink, DatePipe, DecimalPipe, TranslateModule],
  templateUrl: './patient-visit-view.component.html',
  styleUrl: './patient-visit-view.component.css'
})
export class PatientVisitViewComponent implements OnInit {
  visitView: PatientVisits = {
    id: 0,
    patientId: 0,
    diagnoses: '',
    inclinicTreatment: '',
    inhouseTreatment: '',
    treatmentCost: 5,
    onDutyDrName: '',
    visitDate: '',
  };
  form!: FormGroup;
  patientVisits = inject(PatientVisitsService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  onSubmit() {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          const idNumber = parseInt(id, 10);
          // Get visit by visit ID (the endpoint /patient/{id} actually filters by visit Id)
          this.patientVisits.getVisitById(idNumber).subscribe({
            next: (response) => {
              // The API returns an array, get the first visit
              if (Array.isArray(response) && response.length > 0) {
                this.visitView = response[0];
              }
            },
            error: (err) => {
              console.error('Error loading visit:', err);
            }
          });
        }
      },
    });
  }
}
