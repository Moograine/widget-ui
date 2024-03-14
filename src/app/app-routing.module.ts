import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WidgetComponent } from './features/widget/widget.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'widget'
  },
  {
    path: '',
    component: WidgetComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
