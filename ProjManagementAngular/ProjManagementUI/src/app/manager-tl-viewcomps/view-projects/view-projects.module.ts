import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewProjectsComponent } from './view-projects.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ViewProjectsComponent }
];

@NgModule({
  declarations: [ViewProjectsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes) // For lazy loading
  ]
})
export class ViewProjectsModule { }
