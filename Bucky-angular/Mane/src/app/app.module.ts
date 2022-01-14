import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OverviewComponent } from './components/overview/overview.component';
import { SideviewComponent } from './components/sideview/sideview.component';
import { MainviewModule } from './mainview/mainview.module';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    SideviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MainviewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
