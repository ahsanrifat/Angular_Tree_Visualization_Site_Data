import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3GraphTextNodeComponent } from './d3-graph-text-node.component';

describe('D3GraphTextNodeComponent', () => {
  let component: D3GraphTextNodeComponent;
  let fixture: ComponentFixture<D3GraphTextNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [D3GraphTextNodeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(D3GraphTextNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
