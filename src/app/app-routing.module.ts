import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthorizeComponent } from './components/authorize/authorize.component';
import { CheckistComponent } from './components/checklist/checklist.component';
import { ModalComponent } from './components/modal/modal.component';


const routes: Routes = [
  { path: 'authorize', component: AuthorizeComponent },
  { path: 'checklist', component: CheckistComponent},
  { path: 'modal', component: ModalComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
