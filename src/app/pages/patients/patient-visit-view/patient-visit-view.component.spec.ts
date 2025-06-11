import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientVisitViewComponent } from './patient-visit-view.component';

describe('PatientVisitViewComponent', () => {
  let component: PatientVisitViewComponent;
  let fixture: ComponentFixture<PatientVisitViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientVisitViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientVisitViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
