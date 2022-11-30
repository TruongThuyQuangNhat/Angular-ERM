import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NhanvienComponent } from './nhanvien/nhanvien.component';
import { PagenhanvienComponent } from './nhanvien/pagenhanvien/pagenhanvien.component';

const routes: Routes = [
  { path: 'nhanvien', component: NhanvienComponent },
  { path: 'nhanvien/create', component: PagenhanvienComponent },
  { path: 'nhanvien/:id', component: PagenhanvienComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
