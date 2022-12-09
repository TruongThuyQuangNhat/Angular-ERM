import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IChucDanh } from 'src/app/models/ChucDanhModel';
import { IChucVu } from 'src/app/models/ChucVuModel';
import { IPhongBan } from 'src/app/models/PhongBanModel';
import { ITempModel } from 'src/app/models/TempModel';
import { INhanVien } from '../nhanvien.interface';

@Injectable({
  providedIn: 'root'
})
export class PagenhanvienService {

  constructor(private http: HttpClient) { }

  uploads(data: FormData){
    let url = `https://localhost:5001/api/NhanVien/`;
    return this.http.post<{message: string, url: string}>(url, data).pipe()
  }

  createUser(data: INhanVien){
    let url = 'https://localhost:5001/api/NhanVien/InsertNhanVien';
    return this.http.post(url, data).pipe();
  }

  getListChucDanh(){
    let url = 'https://localhost:5001/api/ChucDanh/GetAllChucDanh?limit=50';
    return this.http.get<IChucDanh[]>(url).pipe();
  }
  getListChucVu(){
    let url = 'https://localhost:5001/api/ChucVu/GetAllChucVu?limit=50';
    return this.http.get<IChucVu[]>(url).pipe();
  }
  getListPhongBan(){
    let url = `https://localhost:5001/api/PhongBan/GetAllPhongBan`;
    return this.http.get<ITempModel[]>(url).pipe();
  }
  getOneNhanVien(id: string){
    let url = "https://localhost:5001/api/NhanVien/GetNhanVien?id="+id;
    return this.http.get<INhanVien>(url).pipe();
  }
  updateNhanVien(nhanvien: INhanVien){
    let url = "https://localhost:5001/api/NhanVien/UpdateNhanVien";
    return this.http.put(url, nhanvien).pipe();
  }
  getOnePhongBan(id: string){
    let url = "https://localhost:5001/api/PhongBan/GetPhongBan?id=" + id;
    return this.http.get<IPhongBan>(url).pipe();
  }
}
