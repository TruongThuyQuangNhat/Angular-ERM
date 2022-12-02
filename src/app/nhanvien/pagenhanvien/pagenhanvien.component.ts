import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription, switchMap } from 'rxjs';
import { IChucDanh } from 'src/app/models/ChucDanhModel';
import { IChucVu } from 'src/app/models/ChucVuModel';
import { IPhongBan } from 'src/app/models/PhongBanModel';
import { INhanVien } from '../nhanvien.interface';
import { PagenhanvienService } from './pagenhanvien.service';

@Component({
  selector: 'app-pagenhanvien',
  templateUrl: './pagenhanvien.component.html',
  styleUrls: ['./pagenhanvien.component.css']
})
export class PagenhanvienComponent implements OnInit {
  constructor(
    private _pnvService: PagenhanvienService,
    private _snackBar: MatSnackBar,
    private router: Router,
    public route: ActivatedRoute,
    
  ){}
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap.get("id");
    if(routeParams != null){
      this._pnvService.getOneNhanVien(routeParams).pipe(switchMap(async (data) => data)).subscribe((data: INhanVien) => {
        console.log(data)
        
        this.NhanVien_Id = data.id;
        this.imageName = data.image;
        this.formTitle = 'Chỉnh Sửa Thông Tin Nhân Viên';
        this.myForm = new FormGroup({
          id: new FormControl(data.id,Validators.required),
          firstName: new FormControl(data.firstName,Validators.required),
          lastName: new FormControl(data.lastName,Validators.required),
          fileSource: new FormControl(),
          fileControl: new FormControl(),
          chucDanh_id: new FormControl(data.chucDanh_ID,Validators.required),
          chucVu_id: new FormControl(data.chucVu_ID,Validators.required),
          phongBan_id: new FormControl(data.phongBan_ID,Validators.required),
        });
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
    this._pnvService.getListChucDanh().subscribe((data: IChucDanh[]) => {
      this.ChucDanhList = data;
    });
    this._pnvService.getListChucVu().subscribe((data: IChucVu[]) => {
      this.ChucVuList = data;
    });
    this._pnvService.getListPhongBan().subscribe((data: IPhongBan[]) => {
      this.PhongBanList = data;
    })
  }
  NhanVien_Id = '';
  myForm!: FormGroup; 
  imageProduct = ''; // base64
  imageName = '';
  reader!: FileReader;
  formTitle = "Thêm Mới Nhân Viên";
  ChucDanhList: IChucDanh[] = [];
  ChucVuList: IChucVu[] = [];
  PhongBanList: IPhongBan[] = []

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
  }
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
      const upload = this._pnvService.uploads(formData);
      upload.subscribe((data:{message: string, url: string}) => {
        this.imageName = data.url;
        const temp: INhanVien = {
          id: id?.value,
          firstName: firstName?.value,
          lastName: lastName?.value,
          image: this.imageName,
          chucDanh_ID: chucDanh_id?.value,
          chucVu_ID: chucVu_id?.value,
          phongBan_ID: phongBan_id?.value,
        }
        this._pnvService.createUser(temp).subscribe(
          (value: any)=> {
          if(value.FirstName && value.LastName){
            this._snackBar.open('Thêm mới thành công Nhân Viên '+value.FirstName+" "+value.LastName, "close", { duration: 4000});
          }
          this.router.navigate(["nhanvien"]);
        }, (err => {
          if(err.status === 409){
            this._snackBar.open('ID đã tồn tại, hãy nhập ID khác', "close", { duration: 4000});
          } else {
            this._snackBar.open('Có lỗi khi thêm Nhân Viên, hãy thử lại sau', "close", { duration: 4000});
          }
        }))
      })
    }
  }

}
