import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-confirm-edit',
  templateUrl: './confirm-edit.component.html',
  styleUrls: ['./confirm-edit.component.scss'],
})
export class ConfirmEditComponent implements OnInit {
  @Input() temp: any;
  form: FormGroup;
  emailGroupList: any[];
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
  constructor(
    protected ref: NbDialogRef<ConfirmEditComponent>,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl({ value: this.temp.email, disabled: false }),
      emailGroup: new FormControl({
        value: this.temp.emailGroup,
        disabled: false,
      }),
      emailNew: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      emailGroupNew: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
    });
  }
  copyEmail() {
    this.form.get('emailNew').setValue(this.temp.email);
  }
  copyEmailGroup() {
    this.form.get('emailGroupNew').setValue(this.temp.emailGroup);
  }

  onEdit(value: any) {
    this.ref.close(value);
  }
  dismiss() {
    this.ref.close();
  }
}
