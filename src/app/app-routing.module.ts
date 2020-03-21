import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { CheckistComponent } from './components/checklist/checklist.component';


const routes: Routes = [
  { path: 'authorize', component: AuthorizeComponent },
  { path: 'checklist', component: CheckistComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
