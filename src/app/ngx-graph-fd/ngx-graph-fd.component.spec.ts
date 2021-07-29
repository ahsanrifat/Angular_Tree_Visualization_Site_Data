import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGraphFdComponent } from './ngx-graph-fd.component';

describe('NgxGraphFdComponent', () => {
  let component: NgxGraphFdComponent;
  let fixture: ComponentFixture<NgxGraphFdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxGraphFdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGraphFdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
