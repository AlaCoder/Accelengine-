import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementDocumentComponent } from './management-document.component';

describe('ManagementDocumentComponent', () => {
  let component: ManagementDocumentComponent;
  let fixture: ComponentFixture<ManagementDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagementDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagementDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
