import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhanvienComponent } from './nhanvien/nhanvien.component';

const routes: Routes = [
  { path: 'nhanvien', component: NhanvienComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
