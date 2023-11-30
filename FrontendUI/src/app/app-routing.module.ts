import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees/employees.component';
import { AddEditComponent } from './add-edit/add-edit.component';

const routes: Routes = [
  {path:'', component: EmployeesComponent},
  {path:'add-edit', component: AddEditComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
