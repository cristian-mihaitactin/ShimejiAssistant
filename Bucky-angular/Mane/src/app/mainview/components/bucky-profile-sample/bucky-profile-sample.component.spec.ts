import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuckyProfileSampleComponent } from './bucky-profile-sample.component';

describe('BuckyProfileSampleComponent', () => {
  let component: BuckyProfileSampleComponent;
  let fixture: ComponentFixture<BuckyProfileSampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuckyProfileSampleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuckyProfileSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
