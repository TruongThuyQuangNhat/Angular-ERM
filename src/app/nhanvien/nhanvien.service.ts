import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResNhanVien } from './nhanvien.interface';

@Injectable({
  providedIn: 'root'
})
export class NhanvienService {

  constructor(private http: HttpClient) { }

  getListUser(page: string, limit: string, search: string, key: string, options: string){
    let url = `https://localhost:5001/api/NhanVien/GetAllNhanVien?page=${page}&limit=${limit}&search=${search}&key=${key}&options=${options}`;
    return this.http.get<IResNhanVien[]>(url).pipe();
  }

  getTotalCount(search: string){
    let url = `https://localhost:5001/api/NhanVien/TotalCountOfGetAll?search=${search}`;
    return this.http.get<number>(url).pipe();
  }

  deleteNhanVien(id: string){
    let url = `https://localhost:5001/api/NhanVien/DeleteNhanVien?Id=${id}`;
    return this.http.delete<string>(url).pipe();
  }
}
