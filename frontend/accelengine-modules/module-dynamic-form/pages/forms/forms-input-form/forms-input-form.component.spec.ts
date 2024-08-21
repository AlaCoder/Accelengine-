import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsInputFormComponent } from './forms-input-form.component';

describe('InputComponent', () => {
  let component: FormsInputFormComponent;
  let fixture: ComponentFixture<FormsInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormsInputFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
