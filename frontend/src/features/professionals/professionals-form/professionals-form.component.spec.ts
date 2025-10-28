import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionalsFormComponent } from './professionals-form.component';

describe('ProfessionalsFormComponent', () => {
  let component: ProfessionalsFormComponent;
  let fixture: ComponentFixture<ProfessionalsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionalsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessionalsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
