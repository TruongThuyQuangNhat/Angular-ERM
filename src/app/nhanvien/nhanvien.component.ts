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
import { PagenhanvienService } from "./pagenhanvien/pagenhanvien.service";
import { IPhongBan } from "../models/PhongBanModel";
import { ITempModel } from "../models/TempModel";
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

interface ExampleFlatNode {
  expandable: boolean;
  name: IPhongBan | undefined;
  level: number;
}
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
    private _pnvService: PagenhanvienService,
  ){}
  ngOnDestroy(): void {
    if(this.getListUser$){
      this.getListUser$.unsubscribe();
    }
    if(this.getTotalCount$){
      this.getTotalCount$.unsubscribe();
    }
    if(this.getListPhongBan$){
      this.getListPhongBan$.unsubscribe();
    }
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  initData(page: number, limit: number){
    this.getListUser$ = this.nvService.getListUser(
      page?page.toString():'0', limit?limit.toString():'5',
      this.searchString, this.key, 
      this.options, this.chucDanh_id, this.chucVu_id, this.phongBan_id).subscribe(data => {
      this.dataSource = new MatTableDataSource<IResNhanVien>(data);
    });
    this.getTotalCount$ = this.nvService.getTotalCount(
      this.searchString, 
      this.chucDanh_id, 
      this.chucVu_id, 
      this.phongBan_id
    ).subscribe(data => {
      this.length = data;
    })
    this.pageIndex = page;
    this.pageSize = limit;
  };
  ngOnInit(): void {
    this.initData(this.pageIndex, this.pageSize);
    this.getListPhongBan$ = this._pnvService.getListPhongBan().subscribe((data: ITempModel[]) => {
      this.dataSourceTree.data = data;
    });
  }
  getListPhongBan$!: Subscription;
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
  ];
  chucDanh_id: string = "";
  chucVu_id: string = "";
  phongBan_id: string = "";
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
      this.initData(0, this.pageSize);
    }
  }

  Clear(){
    this.key = "";
    this.options = "";
    this.searchString = "";
    this.pageIndex = 0;
    this.length = 0;
    this.chucDanh_id = "";
    this.chucVu_id = "";
    this.phongBan_id = "";
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
            this._snackBar.open('Xóa Thành Công Nhân Viên', 'close', {duration: 4000});
            
            if(this.length % this.pageSize == 1){
              this.initData(this.pageIndex - 1, this.pageSize);
            } else {
              this.initData(this.pageIndex, this.pageSize);
            }
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

  OnClickPhongBan(id: string){
    this.phongBan_id = id;
    this.pageIndex = 0;
    this.initData(this.pageIndex, this.pageSize);
  }

  ///////////////////  tree  ////////////////////////////////
  private _transformer = (node: ITempModel, level: number) => {
    return {
      expandable: !!node.listTempModel && node.listTempModel.length > 0,
      name: node.PhongBan,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.listTempModel,
  );

  dataSourceTree = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
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