import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PatientVisits } from '../../../interfaces/patient-visits';
import { PatientVisitsService } from '../../../services/patient-visits.service';

@Component({
  selector: 'app-patient-visits-add',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-visits-add.component.html',
  styleUrl: './patient-visits-add.component.css'
})
export class PatientVisitsAddComponent {
  newVisit: PatientVisits = {
    id: 0,
    patientId: 0,
    diagnoses: '',
    inclinicTreatment: '',
    inhouseTreatment: '',
    treatmentCost: 0,
    onDutyDrName: '',
    visitDate: '',
  };

  patientVisitService = inject(PatientVisitsService);

  constructor(private router: Router, private route: ActivatedRoute) {}

  onSubmit() {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          const idNumber = parseInt(id, 10);
          this.newVisit.patientId = idNumber;
          this.patientVisitService.addVisit(this.newVisit).subscribe({
            next: (visit) => {
              this.router.navigate(['/patient-visits/' + idNumber]);
            },
            error: (err) => {
              console.log(err);
            },
          });
        }
      },
    });
  }
}
