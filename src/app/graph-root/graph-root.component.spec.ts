import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphRootComponent } from './graph-root.component';

describe('GraphRootComponent', () => {
  let component: GraphRootComponent;
  let fixture: ComponentFixture<GraphRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphRootComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
