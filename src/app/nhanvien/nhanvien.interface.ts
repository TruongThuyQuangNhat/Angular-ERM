export interface INhanVien {
    Id: string,
    FirstName: string,
    LastName: string,
    Image: string,
    ChucVu_Id: string,
    ChucDanh_Id: string,
    PhongBan_Id: string,
}

export interface IResNhanVien {
    Id: string,
    FirstName: string,
    LastName: string,
    Image: string,
    TenChucVu: string
    TenChucDanh: string,
    TenPhongBan: string,
}