import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription, switchMap, forkJoin } from 'rxjs';
import { IChucDanh } from 'src/app/models/ChucDanhModel';
import { IChucVu } from 'src/app/models/ChucVuModel';
import { IPhongBan } from 'src/app/models/PhongBanModel';
import { INhanVien } from '../nhanvien.interface';
import { PagenhanvienService } from './pagenhanvien.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { ITempModel } from 'src/app/models/TempModel';

interface ExampleFlatNode {
  expandable: boolean;
  name: IPhongBan | undefined;
  level: number;
}
@Component({
  selector: 'app-pagenhanvien',
  templateUrl: './pagenhanvien.component.html',
  styleUrls: ['./pagenhanvien.component.css']
})
export class PagenhanvienComponent implements OnInit, OnDestroy {
  constructor(
    private _pnvService: PagenhanvienService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public route: ActivatedRoute,
    
  ){}
  ngOnDestroy(): void {
    if(this.getListChucDanh$){
      this.getListChucDanh$.unsubscribe();
    }
    if(this.getListChucVu$){
      this.getListChucVu$.unsubscribe();
    }
    if(this.getListPhongBan$){
      this.getListPhongBan$.unsubscribe();
    }
    if(this.getOneNhanVien$){
      this.getOneNhanVien$.unsubscribe();
    }
    if(this.uploads$){
      this.uploads$.unsubscribe();
    }
    if(this.createUser$){
      this.createUser$.unsubscribe();
    }
    if(this.getOnePhongBan$){
      this.getOnePhongBan$.unsubscribe();
    }
  }
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap.get("id");
    if(routeParams != null){
      this.getOneNhanVien$ = this._pnvService.getOneNhanVien(routeParams).subscribe((data: INhanVien) => {
        this.NhanVien_Id = data.Id;
        this.imageName = data.Image;
        this.formTitle = 'Chỉnh Sửa Thông Tin Nhân Viên';
        this.btnSubmit = 'Lưu Lại';
        this.phongBanId = data.PhongBan_ID;
        this.myForm = new FormGroup({
          id: new FormControl(data.Id,Validators.required),
          firstName: new FormControl(data.FirstName,Validators.required),
          lastName: new FormControl(data.LastName,Validators.required),
          fileSource: new FormControl(),
          fileControl: new FormControl(),
          chucDanh_id: new FormControl(data.ChucDanh_ID,Validators.required),
          chucVu_id: new FormControl(data.ChucVu_ID,Validators.required),
          phongBan_id: new FormControl(data.PhongBan_ID,Validators.required),
        });
        this.getOnePhongBan$ = this._pnvService.getOnePhongBan(this.phongBanId).subscribe((data: IPhongBan) => {
          this.phongBan = data;
        })
      });
    } else {
      this.myForm = new FormGroup({
        id: new FormControl('',Validators.required),
        firstName: new FormControl('',Validators.required),
        lastName: new FormControl('',Validators.required),
        image: new FormControl('',Validators.required),
        fileSource: new FormControl(),
        fileControl: new FormControl(),
        chucDanh_id: new FormControl('',Validators.required),
        chucVu_id: new FormControl('',Validators.required),
        phongBan_id: new FormControl('',Validators.required),
      });
    }
    this.getListChucDanh$ = this._pnvService.getListChucDanh().subscribe((data: IChucDanh[]) => {
      this.ChucDanhList = data;
    });
    this.getListChucVu$ = this._pnvService.getListChucVu().subscribe((data: IChucVu[]) => {
      this.ChucVuList = data;
    });
    this.getListPhongBan$ = this._pnvService.getListPhongBan().subscribe((data: ITempModel[]) => {
      this.dataSource.data = data;
    });
  }
  getOnePhongBan$!: Subscription;
  phongBanId!: string;
  phongBan!: IPhongBan;
  getOneNhanVien$!: Subscription;
  getListChucDanh$!: Subscription;
  getListChucVu$!: Subscription;
  getListPhongBan$!: Subscription;
  uploads$!: Subscription;
  createUser$!: Subscription;
  updateUser$!: Subscription;
  NhanVien_Id = '';
  myForm!: FormGroup; 
  imageProduct = ''; // base64
  imageName = '';
  reader!: FileReader;
  btnSubmit = 'Thêm mới';
  formTitle = "Thêm Mới Nhân Viên";
  ChucDanhList: IChucDanh[] = [];
  ChucVuList: IChucVu[] = [];
  //PhongBanList: ITempModel[] = [];

  onFileSelected(event: Event) {
    this.reader = new FileReader();

    const element = event.target as HTMLInputElement;
    if (element.files) {
      const file = element.files[0];
      this.myForm.patchValue({
        fileSource: file,
      });
    }
    const source = this.myForm.get("fileSource");
    if (source) {
      this.reader.readAsDataURL(source.value);
    }
    this.reader.onload = this.readSuccess;
  };
  readSuccess = () => {
    if (this.reader.result) {
      this.imageProduct = this.reader.result.toString();
    }
  };
  Cancel(){
    this.router.navigate(["nhanvien"]);
  }
  Submit(){
    const formData = new FormData();
    const fileSource = this.myForm.get("fileSource");
    const id = this.myForm.get("id");
    const firstName = this.myForm.get("firstName");
    const lastName = this.myForm.get("lastName");
    const chucDanh_id = this.myForm.get("chucDanh_id");
    const chucVu_id = this.myForm.get("chucVu_id");
    const phongBan_id = this.myForm.get("phongBan_id");
    if (fileSource?.value != null){
      formData.append("photo", fileSource.value);
      this.uploads$ = this._pnvService.uploads(formData)
      .subscribe((data:{message: string, url: string}) => {
        this.imageName = data.url;
        const temp: INhanVien = {
          Id: id?.value,
          FirstName: firstName?.value,
          LastName: lastName?.value,
          Image: this.imageName,
          ChucDanh_ID: chucDanh_id?.value,
          ChucVu_ID: chucVu_id?.value,
          PhongBan_ID: phongBan_id?.value,
        }
        if(this.NhanVien_Id != ''){
          this.updateUser(temp);
        } else {
          this.createUser(temp);
        }
      })
    } else {
      const temp: INhanVien = {
        Id: id?.value,
        FirstName: firstName?.value,
        LastName: lastName?.value,
        Image: this.imageName,
        ChucDanh_ID: chucDanh_id?.value,
        ChucVu_ID: chucVu_id?.value,
        PhongBan_ID: phongBan_id?.value,
      }
      if(this.NhanVien_Id != ''){
        this.updateUser(temp);
      } else {
        this.createUser(temp);
      }
    }
  }
  createUser = (temp: INhanVien)=>{
    this.createUser$ = this._pnvService.createUser(temp).subscribe(
      (value: any)=> {
        if(value.FirstName && value.LastName){
          this._snackBar.open('Thêm mới thành công Nhân Viên '+value.FirstName+" "+value.LastName, "close", { duration: 4000});
        }
        this.router.navigate(["nhanvien"]);
      }, 
      (err: { status: number; }) => {
        if(err.status === 409){
          this._snackBar.open('ID đã tồn tại, hãy nhập ID khác', "close", { duration: 4000});
        } else {
          this._snackBar.open('Có lỗi khi thêm Nhân Viên, hãy thử lại sau', "close", { duration: 4000});
        }
      },
    );
  };
  updateUser = (temp: INhanVien) => {
    this.updateUser$ = this._pnvService.updateNhanVien(temp).subscribe(
      (value: any)=> {
        this._snackBar.open('Cập Nhật thành công Nhân Viên ', "close", { duration: 4000});
        this.router.navigate(["nhanvien"]);
      }, 
      (err: { status: number; }) => {
        if(err.status === 409){
          this._snackBar.open('ID không tồn tại', "close", { duration: 4000});
        } else {
          this._snackBar.open('Có lỗi khi Cập Nhật thông tin Nhân Viên, hãy thử lại sau', "close", { duration: 4000});
        }
      },
    )
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

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
}
