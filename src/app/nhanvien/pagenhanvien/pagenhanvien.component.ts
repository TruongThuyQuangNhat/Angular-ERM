import { Component } from '@angular/core';

@Component({
  selector: 'app-pagenhanvien',
  templateUrl: './pagenhanvien.component.html',
  styleUrls: ['./pagenhanvien.component.css']
})
export class PagenhanvienComponent {
  id = "";
  firstName = "";
  lastName = "";
  image = ""
  chucDanh_id = ""
  ChucDanhList = [];
  chucVu_id = "";
  ChucVuList = [];
  phongBan_id = ""
  PhongBanList = []
}
