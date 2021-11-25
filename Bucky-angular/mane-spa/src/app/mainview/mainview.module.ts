import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegratedServicesComponent } from './components/integrated-services/integrated-services.component';
import { AssistantProfileComponent } from './components/assistant-profile/assistant-profile.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [IntegratedServicesComponent, AssistantProfileComponent]
})
export class MainviewModule { }
