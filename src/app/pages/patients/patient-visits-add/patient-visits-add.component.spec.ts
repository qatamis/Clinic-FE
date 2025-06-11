import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitsAddComponent } from './patient-visits-add.component';

describe('PatientVisitsAddComponent', () => {
  let component: PatientVisitsAddComponent;
  let fixture: ComponentFixture<PatientVisitsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientVisitsAddComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientVisitsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
