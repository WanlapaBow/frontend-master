import { Component, OnInit } from '@angular/core';
import { NbToastrService } from '@nebular/theme';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonService } from '../../../../_helpers/common.service';
import { UploadDialogService } from '../upload-dialog/upload-dialog.service';

@Component({
  selector: 'ngx-confirm-button',
  template: ` <button
    class="btn"
    nbButton
    size="small"
    status="primary"
    [disabled]="params.data['status'] !== 'Validated' || isDisable"
    (click)="click()"
  >
    Confirm
  </button>`,
  styleUrls: [],
})
export class ConfirmButtonComponent implements OnInit {
  public params: ICellRendererParams;

  isLoading: boolean = true;
  isDisable: boolean = false;
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
    uploadSuccess: {
      message: 'อัพโหลดข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    uploadError: {
      message: 'อัพโหลดข้อมูลไม่สำเร็จ',
      title: 'ไม่สำเร็จ',
    },
  };
  constructor(
    private service: UploadDialogService,
    public commonService: CommonService,
    private toastrService: NbToastrService,
  ) {}

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  ngOnInit(): void {
    // this.params = params;
  }
  click() {
    this.isLoading = true;
    const jobInfoId = this.params.node.data.jobInfoId;
    this.isDisable = true;
    this.service.confirm(jobInfoId).subscribe(
      (response: any) => {
        const status = response.payload ? 'success' : 'danger';
        if (response.status === 'OK') {
          this.toastrService.show(
            this.toastrMsg.uploadSuccess.message,
            this.toastrMsg.uploadSuccess.title,
            {
              status,
              duration: 5000,
              limit: 1,
            },
          );
          this.isLoading = false;
        } else {
          this.isDisable = true;
          this.toastrService.show(
            this.toastrMsg.uploadError.message,
            this.toastrMsg.uploadError.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.isLoading = false;
        }
      },
      (err) => {
        this.toastrService.show(
          this.toastrMsg.uploadError.message,
          this.toastrMsg.uploadError.title,
          {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          },
        );
        this.isLoading = false;
      },
    );
  }
}
