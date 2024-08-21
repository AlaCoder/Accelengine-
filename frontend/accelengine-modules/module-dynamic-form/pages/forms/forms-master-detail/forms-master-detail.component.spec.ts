import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsMasterDetailComponent } from './forms-master-detail.component';

describe('TypeMasterDetailComponent', () => {
  let component: FormsMasterDetailComponent;
  let fixture: ComponentFixture<FormsMasterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsMasterDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsMasterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
