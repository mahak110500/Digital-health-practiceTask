import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieChartCardComponent } from './pie-chart-card.component';

describe('PieChartCardComponent', () => {
  let component: PieChartCardComponent;
  let fixture: ComponentFixture<PieChartCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieChartCardComponent]
    });
    fixture = TestBed.createComponent(PieChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
