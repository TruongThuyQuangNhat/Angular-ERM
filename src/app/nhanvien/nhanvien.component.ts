import { PageEvent } from "@angular/material/paginator";
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableDataSourcePaginator} from '@angular/material/table';
import { NhanvienService } from "./nhanvien.service";
import { INhanVien, IResNhanVien } from "./nhanvien.interface";
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from "@angular/router";
@Component({
  selector: 'app-nhanvien',
  templateUrl: './nhanvien.component.html',
  styleUrls: ['./nhanvien.component.css']
})
export class NhanvienComponent implements OnInit {
  constructor(
    private nvService: NhanvienService,
    private _snackBar: MatSnackBar,
    private router: Router,
  ){}
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  initData(){
    const ListNhanVienSup = this.nvService.getListUser(
      this.pageEvent.pageIndex?this.pageEvent.pageIndex.toString():this.pageIndex.toString(), 
      this.pageEvent.pageSize?this.pageEvent.pageSize.toString():this.pageSize.toString(),
      this.searchString, this.key, 
      this.options).subscribe(data => {
      this.dataSource = new MatTableDataSource<IResNhanVien>(data);
    });
    const TotalCountSup = this.nvService.getTotalCount(this.searchString).subscribe(data => {
      this.pageEvent.length = data;
    })
  }
  ngOnInit(): void {
    this.initData();
  }
  dataSource = new MatTableDataSource<IResNhanVien>([]);
  searchString = "";
  key = "";
  keys = [
    {
      view: "None",
      value: ""
    },
    {
      view: "Tên",
      value: "firstname"
    },
    {
      view: "Họ",
      value: "lastname"
    }
  ];
  options = "";
  optList = [
    {
      view: "None",
      value: ""
    },
    {
      view: "A-Z",
      value: "asc"
    },
    {
      view: "Z-A",
      value: "desc"
    }
  ]
  pageEvent: PageEvent = new PageEvent();
  pageIndex = 1;
  length = 0;
  pageSize = 5;
  displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'Image', 'TenChucDanh', 'TenChucVu', 'TenPhongBan', 'Actions'];
  handlepaginator(value: PageEvent){
    this.pageEvent.pageIndex = value.pageIndex + 1;
    this.pageEvent.pageSize = value.pageSize;
    this.initData();
    return value;
  }
  Submit(){
    if((this.key == "" && this.options != "") || (this.key != "" && this.options == "")){
      this._snackBar.open("Cần Chọn Cả 2 Trường Column và Options để Sort!", "close")
    } else {
      this.initData();
    }
  }

  Clear(){
    this.key = "";
    this.options = "";
    this.searchString = "";
    this.initData();
  }

  EditPage(id: string){
    this.router.navigate(["nhanvien/" + id]);
  }

  AddPage(){
    this.router.navigate(["nhanvien/create"]);
  }
}