import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuresChartComponent } from './measures-chart.component';

describe('MeasuresChartComponent', () => {
  let component: MeasuresChartComponent;
  let fixture: ComponentFixture<MeasuresChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasuresChartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeasuresChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
