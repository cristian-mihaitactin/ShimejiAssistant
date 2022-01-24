import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PluginSampleComponent } from './plugin-sample.component';

describe('IntegratedServicesComponent', () => {
  let component: PluginSampleComponent;
  let fixture: ComponentFixture<PluginSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PluginSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
