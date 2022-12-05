import { PageEvent } from "@angular/material/paginator";
import {AfterViewInit, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTableDataSourcePaginator} from '@angular/material/table';
import { NhanvienService } from "./nhanvien.service";
import { INhanVien, IResNhanVien } from "./nhanvien.interface";
import {MatSnackBar} from '@angular/material/snack-bar';
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-nhanvien',
  templateUrl: './nhanvien.component.html',
  styleUrls: ['./nhanvien.component.css']
})
export class NhanvienComponent implements OnInit, OnDestroy {
  constructor(
    private nvService: NhanvienService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public dialog: MatDialog,
  ){}
  ngOnDestroy(): void {
    this.getListUser$.unsubscribe();
    this.getTotalCount$.unsubscribe();
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  initData(page: number, limit: number){
    this.getListUser$ = this.nvService.getListUser(
      page?page.toString():'0', limit?limit.toString():'5',
      this.searchString, this.key, 
      this.options).subscribe(data => {
      this.dataSource = new MatTableDataSource<IResNhanVien>(data);
    });
    this.getTotalCount$ = this.nvService.getTotalCount(this.searchString).subscribe(data => {
      this.length = data;
    })
    this.pageIndex = page;
    this.pageSize = limit;
    console.log("page:", this.pageIndex, "- limit: ", this.pageSize, ' - length', this.length);
  };
  ngOnInit(): void {
    this.initData(this.pageIndex, this.pageSize);
  }
  getListUser$!: Subscription;
  getTotalCount$!: Subscription;
  dataSource = new MatTableDataSource<IResNhanVien>([]);
  searchString = "";
  pageIndex!: number;
  pageSize!: number;
  length!: number;
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
  displayedColumns: string[] = ['Id', 'FirstName', 'LastName', 'Image', 'TenChucDanh', 'TenChucVu', 'TenPhongBan', 'Actions'];
  handlePageEvent(value: PageEvent){
    this.pageEvent = value;
    this.pageIndex = value.pageIndex ;
    this.pageSize = value.pageSize;
    this.length = value.length;
    this.initData(this.pageIndex, this.pageSize);
    return value;
  }
  Submit(){
    if((this.key == "" && this.options != "") || (this.key != "" && this.options == "")){
      this._snackBar.open("Cần Chọn Cả 2 Trường Column và Options để Sort!", "close")
    } else {
      this.initData(1, this.pageSize);
    }
  }

  Clear(){
    this.key = "";
    this.options = "";
    this.searchString = "";
    this.pageIndex = 1;
    this.pageSize = 5;
    this.length = 0
    this.initData(this.pageIndex, this.pageSize);
  }

  EditPage(id: string){
    this.router.navigate(["nhanvien/" + id]);
  }

  AddPage(){
    this.router.navigate(["nhanvien/create"]);
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, fn: string, ln: string, id: string): void {
    const dialogRef = this.dialog.open(DialogDelete, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {fn, ln, id},
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result != undefined){
        this.nvService.deleteNhanVien(result).subscribe(
          (data: any)=>{
            console.log(this.pageSize, this.pageIndex)
            // const page = Number(this.pageEvent.pageIndex) + 1;
            // this._snackBar.open('Xóa Thành Công Nhân Viên', 'close', {duration: 4000});
            
            // if(this.pageEvent.length % this.pageEvent.pageSize == 1){
            //   this.pageEvent.pageIndex = this.pageEvent.pageIndex;
            //   this.initData(this.pageEvent.pageIndex, this.pageEvent.pageSize);
            // } else {
            //   this.pageEvent.pageIndex = this.pageEvent.pageIndex -1;
            //   this.initData(this.pageEvent.pageIndex, this.pageEvent.pageSize);
            // }
          },
          (err)=>{
            if(err.status == 404){
              this._snackBar.open('ID Nhân Viên Không Tồn Tại nên Không Thể Xóa', 'close', {duration: 4000});
            } else {0
              this._snackBar.open('Có Lỗi Khi Xóa Nhân Viên, Thử Lại Sau', 'close', {duration: 4000});
            };
          }
        )
      }
    });
  }
}

@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogDelete {
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: {fn: string, ln: string, id: string},
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
}