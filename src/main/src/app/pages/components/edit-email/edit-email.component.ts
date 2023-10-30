import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { EditEmailService } from './edit-email.service';

@Component({
  selector: 'ngx-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss'],
})
export class EditEmailComponent implements OnInit {
  @Input() oldEmail: any;
  loading: boolean = false;
  isDisable: boolean = false;
  form: FormGroup;
  showPassword = false;
  hostNameList: any[];
  toastrMsg = {
    waiting: {
      message: 'กำลังค้นหาข้อมูล',
      title: 'กำลังค้นหา',
    },
    noData: {
      message: 'ไม่พบข้อมูล',
      title: 'สำเร็จ',
    },
    noFile: {
      message: 'ไม่พบข้อมูลไฟล์',
      title: 'ไม่สำเร็จ',
    },
    searchSuccess: {
      message: 'ค้นหาข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    saveSuccess: {
      message: 'บันทึกข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    error: {
      message: 'ค้นหาข้อมูลไม่สำเร็จ',
      title: 'ไม่สำเร็จ',
    },
  };
  constructor(protected ref: NbDialogRef<EditEmailComponent>,
              private service: EditEmailService,
              private toastrService: NbToastrService) {

  }

  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl({ value: this.oldEmail.code, disabled: false }, Validators.required),
      email: new FormControl({ value: '', disabled: false }, Validators.required),
      password: new FormControl({ value: '', disabled: false }, Validators.required),
      hostName: new FormControl({ value: '', disabled: false }, Validators.required),
      oldEmail: new FormControl({ value: this.oldEmail.email, disabled: false }, Validators.required),
    });
    this.getHostName();
  }
  onSelect(value: any) {
    this.ref.close(value);
  }
  dismiss() {
    this.ref.close();
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  getHostName() {
    this.service.getHostName().subscribe(
      (response: any[]) => {
        this.hostNameList = response['payload'];
      },
      (err) => this.toastrService.show(err.message,
        err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }
}


