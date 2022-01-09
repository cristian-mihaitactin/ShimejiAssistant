import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IvyCarouselModule } from 'angular-responsive-carousel';
import { IntegratedServicesComponent } from './components/integrated-services/integrated-services.component';
import { AssistantProfileComponent } from './components/assistant-profile/assistant-profile.component';
import { BuckyProfileSampleComponent } from './components/bucky-profile-sample/bucky-profile-sample.component';

@NgModule({
  imports: [
    CommonModule,
    IvyCarouselModule
  ],
  exports: [IntegratedServicesComponent, AssistantProfileComponent, BuckyProfileSampleComponent],
  declarations: [IntegratedServicesComponent, AssistantProfileComponent, BuckyProfileSampleComponent]
})
export class MainviewModule { }
