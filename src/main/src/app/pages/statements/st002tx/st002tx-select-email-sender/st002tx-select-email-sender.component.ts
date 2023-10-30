import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { St002txComponent } from '../st002tx.component';
import { St002txSelectEmailSenderService } from './st002tx-select-email-sender.service';

@Component({
  selector: 'ngx-st002tx-select-email-sender',
  templateUrl: './st002tx-select-email-sender.component.html',
  styleUrls: ['./st002tx-select-email-sender.component.scss'],
})
export class St002txSelectEmailSenderComponent implements OnInit {
  emailSenderList: any[];
  form: FormGroup;
  loading: boolean = false;
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
    protected ref: NbDialogRef<St002txComponent>,
    private service: St002txSelectEmailSenderService,
    private toastrService: NbToastrService,
  ) {}
  ngOnInit(): void {
    this.form = new FormGroup({
      code: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
    });
    this.getEmailSender();
  }
  getEmailSender() {
    this.service.getEmailSenderNow().subscribe(
      (response: any[]) => {
        this.emailSenderList = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  onSelect(value: any) {
    this.ref.close(value);
  }
  dismiss() {
    this.ref.close();
  }
}
