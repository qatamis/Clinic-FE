import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { PatientVisits } from '../../../interfaces/patient-visits';
import { PatientVisitsService } from '../../../services/patient-visits.service';

@Component({
  selector: 'app-patient-visits',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    DatePipe,
    TranslateModule,
  ],
  templateUrl: './patient-visits.component.html',
  styleUrl: './patient-visits.component.css'
})
export class PatientVisitsComponent implements OnInit {
  IDnumber: number  = 0;
  visits: PatientVisits[] = [];
  initVisit: PatientVisits = {
    id: 0,
    patientId: 0,
    diagnoses: '',
    inclinicTreatment: '',
    inhouseTreatment: '',
    treatmentCost: 0,
    onDutyDrName: '',
    visitDate: '',
  };
  form!: FormGroup;
  patientVistsService = inject(PatientVisitsService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          const idNumber = parseInt(id, 10);
          this.IDnumber = idNumber;
          this.patientVistsService.getVisitsById(idNumber).subscribe({
            next: (response) => {
              this.visits = response;
            },
          });
        }
      },
    });
  }
}
