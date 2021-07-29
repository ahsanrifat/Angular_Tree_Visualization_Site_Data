import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GraphBubbleComponent } from './d3-graph-bubble.component';

describe('D3GraphBubbleComponent', () => {
  let component: D3GraphBubbleComponent;
  let fixture: ComponentFixture<D3GraphBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3GraphBubbleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GraphBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
