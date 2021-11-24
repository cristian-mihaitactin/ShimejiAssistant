import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssistantProfileComponent } from './assistant-profile.component';

describe('AssistantProfileComponent', () => {
  let component: AssistantProfileComponent;
  let fixture: ComponentFixture<AssistantProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssistantProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssistantProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
