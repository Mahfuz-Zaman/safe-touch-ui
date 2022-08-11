import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderTimelineComponent } from './order-timeline.component';

describe('OrderTimelineComponent', () => {
  let component: OrderTimelineComponent;
  let fixture: ComponentFixture<OrderTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
