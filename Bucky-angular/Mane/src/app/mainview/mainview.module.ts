import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntegratedServicesComponent } from './components/plugins/plugins.component';
import { AssistantProfileComponent } from './components/assistant-profile/assistant-profile.component';
import { BuckyProfileSampleComponent } from './components/bucky-profile-sample/bucky-profile-sample.component';
import { PluginDetailsComponent } from './components/plugin-details/plugin-details.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [IntegratedServicesComponent, AssistantProfileComponent, BuckyProfileSampleComponent],
  declarations: [IntegratedServicesComponent, AssistantProfileComponent, BuckyProfileSampleComponent, PluginDetailsComponent]
})
export class MainviewModule { }
