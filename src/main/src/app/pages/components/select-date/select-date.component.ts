import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDateService, NbDialogRef, NbToastrService} from '@nebular/theme';
import * as moment from 'moment';
import {SelectDateService} from './select-date.service';

@Component({
  selector: 'ngx-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent implements OnInit {
  loading: boolean = false;
  isDisable: boolean = false;
  checkAccount: any;
  form: FormGroup;
  min: Date;
  max: Date;
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
  constructor(protected dateService: NbDateService<Date>, protected ref: NbDialogRef<SelectDateComponent>,
              private service: SelectDateService, private toastrService: NbToastrService) {
    this.min = this.dateService.getMonthStart(this.dateService.today());
    this.max = this.dateService.getMonthEnd(this.dateService.today());
    const date = moment(this.dateService.today()).format('YYYY-MM-DDT00:00:00');
    this.changeAccountDate(date);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      date: new FormControl(
        { value: this.dateService.today(), disabled: this.isDisable },
        Validators.required,
      ),
    });
  }
  onSelect(value: any) {
    this.ref.close(value);
  }
  dismiss() {
    this.ref.close();
  }
  changeAccountDate(event: any) {
    const date = new Date(event);
    date.setHours(date.getHours() - 7);
    const dateFinal = moment(date).format('YYYY-MM-DDTHH:mm:ss[Z]');
    this.service.getCheckPeriod(dateFinal).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.checkAccount = res['payload'];
          this.form.get('date').setValue(dateFinal);
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
      },
    );
  }
}
