import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalGraphComponent } from './optional-graph.component';

describe('OptionalGraphComponent', () => {
  let component: OptionalGraphComponent;
  let fixture: ComponentFixture<OptionalGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionalGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
