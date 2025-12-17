import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject, OnInit, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { PatientExam } from '../../../interfaces/patient-exam';
import { PatientExamsService } from '../../../services/patient-exams.service';

@Component({
  selector: 'app-patient-exams',
  imports: [CommonModule, RouterLink, MatIconModule, MatDialogModule, MatButtonModule, MatDividerModule, DatePipe, TranslateModule],
  templateUrl: './patient-exams.component.html',
  styleUrl: './patient-exams.component.css'
})
export class PatientExamsComponent implements OnInit {
  IDnumber: number = 0;
  exams: PatientExam[] = [];
  patientExamsService = inject(PatientExamsService);
  dialog = inject(MatDialog);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (params) => {
        const id = params.get('id');

        if (id) {
          const idNumber = parseInt(id, 10);
          this.IDnumber = idNumber;
          this.patientExamsService.getExamsByPatientId(idNumber).subscribe({
            next: (response) => {
              this.exams = response;
            },
            error: (err) => {
              console.log(err);
            }
          });
        }
      },
    });
  }

  deleteExam(id: number) {
    const isDeleteConfirmed = confirm("Are you sure you want to delete this exam?");
    if (isDeleteConfirmed) {
      this.patientExamsService.deleteExam(id).subscribe({
        next: () => {
          this.exams = this.exams.filter(exam => exam.id !== id);
        },
        error: (err) => {
          console.log(err);
          alert('Error deleting exam');
        }
      });
    }
  }

  downloadDocument(examId: number, fileName?: string) {
    this.patientExamsService.downloadDocument(examId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || `exam_${examId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.log(err);
        alert('Error downloading document');
      }
    });
  }

  viewDocument(examId: number, fileName?: string) {
    this.patientExamsService.downloadDocument(examId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        this.dialog.open(PdfViewerDialogComponent, {
          width: '90%',
          maxWidth: '1200px',
          height: '90%',
          data: { pdfUrl: url, fileName: fileName || `exam_${examId}.pdf` }
        });
      },
      error: (err) => {
        console.log(err);
        alert('Error loading document');
      }
    });
  }
}

@Component({
  selector: 'app-pdf-viewer-dialog',
  template: `
    <div class="pdf-viewer-container">
      <div class="pdf-viewer-header">
        <h3 mat-dialog-title>{{ data.fileName }}</h3>
        <button mat-icon-button (click)="closeDialog()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-dialog-content class="pdf-viewer-content">
        <iframe [src]="sanitizedUrl" width="100%" height="100%" style="border: none;"></iframe>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="downloadPdf()">
          <mat-icon>download</mat-icon>
          Download
        </button>
        <button mat-button (click)="closeDialog()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .pdf-viewer-container {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .pdf-viewer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }
    .pdf-viewer-header h3 {
      margin: 0;
    }
    .close-button {
      margin-left: auto;
    }
    .pdf-viewer-content {
      flex: 1;
      padding: 0;
      overflow: hidden;
      min-height: 600px;
    }
    mat-dialog-actions {
      padding: 16px;
      border-top: 1px solid #e0e0e0;
    }
  `],
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule]
})
export class PdfViewerDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PdfViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pdfUrl: string; fileName: string },
    private sanitizer: DomSanitizer
  ) {}

  get sanitizedUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.data.pdfUrl);
  }

  downloadPdf() {
    const link = document.createElement('a');
    link.href = this.data.pdfUrl;
    link.download = this.data.fileName;
    link.click();
  }

  closeDialog() {
    window.URL.revokeObjectURL(this.data.pdfUrl);
    this.dialogRef.close();
  }
}
