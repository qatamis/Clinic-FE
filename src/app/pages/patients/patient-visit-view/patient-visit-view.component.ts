import { Component, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientVisits } from '../../../interfaces/patient-visits';
import { PatientVisitsService } from '../../../services/patient-visits.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-patient-visit-view',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './patient-visit-view.component.html',
  styleUrl: './patient-visit-view.component.css'
})
export class PatientVisitViewComponent {
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
          this.patientVisits.getVisitsByPatientId(idNumber).subscribe({
            next: (response) => {
              console.log(response); // Check the response object
              if (Array.isArray(response) && response.length > 0) {
                this.visitView = response[0]; // or pick the correct visit
              }
            },
          });
        }
      },
    });
  }
}
