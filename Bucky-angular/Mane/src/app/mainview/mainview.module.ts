import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PluginSampleComponent } from './components/plugin-sample/plugin-sample.component';
import { AssistantProfileComponent } from './components/assistant-profile/assistant-profile.component';
import { BuckyProfileSampleComponent } from './components/bucky-profile-sample/bucky-profile-sample.component';
import { PluginDetailsComponent } from './components/plugin-details/plugin-details.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [PluginSampleComponent, PluginDetailsComponent, AssistantProfileComponent, BuckyProfileSampleComponent],
  declarations: [PluginSampleComponent, PluginDetailsComponent, AssistantProfileComponent, BuckyProfileSampleComponent]
})
export class MainviewModule { }
