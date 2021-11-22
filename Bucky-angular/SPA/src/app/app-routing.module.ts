import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SideviewComponent } from './sideview/sideview.component';

const routes: Routes = [
  { path: '', component: SideviewComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
