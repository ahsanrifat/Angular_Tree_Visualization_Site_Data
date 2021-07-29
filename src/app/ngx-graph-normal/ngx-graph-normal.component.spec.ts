import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxGraphNormalComponent } from './ngx-graph-normal.component';

describe('NgxGraphNormalComponent', () => {
  let component: NgxGraphNormalComponent;
  let fixture: ComponentFixture<NgxGraphNormalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxGraphNormalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxGraphNormalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
