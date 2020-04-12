import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { ConditionComponent } from './components/condition/condition.component';
import { ModalComponent } from './components/modal/modal.component';


const routes: Routes = [
  { path: 'authorize', component: AuthorizeComponent },
  { path: 'condition', component: ConditionComponent},
  { path: 'modal', component: ModalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
