import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideviewComponent } from './sideview.component';

describe('SideviewComponent', () => {
  let component: SideviewComponent;
  let fixture: ComponentFixture<SideviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
