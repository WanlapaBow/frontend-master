import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { interval } from 'rxjs';
import { UtilsService } from '../../../../_helpers/utils.service';
import { ConfirmButtonComponent } from '../confirm-button/confirm-button.component';
import { DownloadLogBtnComponent } from '../download-log-btn/download-log-btn.component';
import { St002txService } from '../st002tx.service';
import { UploadDialogService } from './upload-dialog.service';

@Component({
  selector: 'ngx-upload-dialog',
  templateUrl: './upload-dialog.component.html',
  styleUrls: ['./upload-dialog.component.scss'],
})
export class UploadDialogComponent implements OnInit {
  form: FormGroup;
  isSelect: boolean = false;
  isUpload: boolean = false;
  isShowLog: boolean = false;

  // Files
  fileName: string = '';
  fileData: File;
  listFile: any[] = [];
  // ag-grid
  gridApiTable: any;
  columnDefs: any;
  defaultColDef;
  rowSelection;
  paginationPageSize;
  paginationPageSizeView: any = 10;
  rowData: any = [];
  // msg
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
  isValidateFile: boolean = false;
  isValidate: boolean = false;
  isLoading: boolean = false;

  isInterval: boolean = false;
  tempLogData: any;
  intervalData: any;
  currentPage: any = 0;
  // paginationPageSize: any = 10;
  totalPages: any = 0;
  isFirstPage: any;
  isLastPage: any;
  // columnLogDefs = logSetting;
  checked = false;
  // defaultColDef = defaultCofDef;
  private gridApi;
  gridLogApi: any;
  gridLogColumnApi: any;
  logData: any[] = [];
  constructor(
    protected ref: NbDialogRef<UploadDialogComponent>,
    private service: St002txService,
    private serviceIn: UploadDialogService,
    private toastrService: NbToastrService,
  ) {
    this.columnDefs = [
      {
        headerName: 'Upload Date',
        field: 'uploadDate',
        width: 150,
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'Filename',
        field: 'fileName',
        width: 150,
      },
      {
        headerName: 'Status',
        field: 'status',
        width: 110,
      },
      {
        headerName: 'Error Message',
        field: 'errorMsg',
        width: 90,
      },
      {
        headerName: 'Total',
        field: 'totalRow',
        width: 90,
      },
      {
        headerName: 'Success',
        field: 'successRow',
        width: 90,
      },
      {
        headerName: 'Error',
        field: 'errorRow',
        width: 80,
      },
      {
        headerName: 'Log',
        field: 'errorLog',
        cellRendererFramework: DownloadLogBtnComponent,
      },
      {
        headerName: 'Confirm',
        field: 'requestId',
        colId: 'params',
        width: 150,
        cellRendererFramework: ConfirmButtonComponent,
      },
    ];
    this.defaultColDef = {
      resizable: true,
      filter: true,
    };
    this.paginationPageSize = 10000;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      filecsv: new FormControl('', Validators.required),
    });
    this.getLog(this.currentPage, 10000, false);
  }

  onGridReady(params) {
    this.gridApiTable = params.api;
  }

  onPaginationChanged(event) {}

  onSubmitValidate() {
    this.isValidate = true;
    this.isUpload = true;
    const requestBody = {
      file: this.fileData,
    };
    this.service.uploadValidate(requestBody).subscribe(
      (response: any) => {
        const status = response.payload ? 'success' : 'danger';
        if (response.status === 'OK') {
          if (response.payload.payload.confirm === true) {
            this.isValidateFile = true;
          } else {
            this.isValidateFile = false;
            this.form.reset();
            this.fileName = null;
          }
          this.toastrService.show(
            this.toastrMsg.uploadSuccess.message,
            this.toastrMsg.uploadSuccess.title,
            {
              status,
              duration: 5000,
              limit: 1,
            },
          );
          const rowDataTable = [response.payload.payload];
          this.rowData = rowDataTable;
          this.isShowLog = true;
          this.isUpload = false;
        } else {
          this.isUpload = false;
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
        this.form.reset();
        this.fileName = null;
        this.isUpload = false;
      },
    );
  }

  onUpload() {
    this.isUpload = true;
    const requestBody = {
      file: this.fileData,
    };
    this.service.uploadConfirm(requestBody).subscribe(
      (response: any) => {
        const status = response.payload ? 'success' : 'danger';
        if (
          response.status === 'OK' &&
          response.payload.payload.confirm === true
        ) {
          this.toastrService.show(
            this.toastrMsg.uploadSuccess.message,
            this.toastrMsg.uploadSuccess.title,
            {
              status,
              duration: 5000,
            },
          );
          this.form.reset();
          this.fileName = null;
          this.isUpload = false;
          this.ref.close(response.payload.payload.confirm);
        }
      },
      (err) => {
        this.isUpload = false;
        this.toastrService.show(
          this.toastrMsg.uploadError.message,
          this.toastrMsg.uploadError.title,
          {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
          },
        );
        this.ref.close();
      },
    );
  }

  getFile(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
    this.fileName = this.fileData.name;
    this.isValidateFile = false;
  }

  dismiss() {
    this.ref.close();
  }
  // new
  onSubmitValidateSchedule() {
    this.isLoading = true;
    const requestBody = {
      file: this.fileData,
    };
    if (this.isInterval) {
      this.destroy();
    }
    this.serviceIn.uploadValidate(requestBody).subscribe(
      (response: any) => {
        const status = response.payload ? 'success' : 'danger';
        if (response.status === 'OK') {
          this.onLog();
          this.form.reset();
          this.fileName = null;
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
          this.onLog();
          this.form.reset();
          this.fileName = null;
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
        this.form.reset();
        this.fileName = null;
        this.isLoading = false;
      },
    );
  }

  private getLog(index, limit, flagPage) {
    this.serviceIn.getLog(index, limit).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          if (this.isInterval === true && flagPage === false) {
            this.tempLogData = res['payload'].content;
            this.updateLog(this.tempLogData);
          } else {
            this.destroy();
            this.logData = res['payload'].content;
            this.setSort();
            this.setInterval();
          }
          this.totalPages = res['payload'].totalPages;
          this.isLastPage = res['payload'].last;
          this.isFirstPage = res['payload'].first;
          // this.isLoading = false;
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.destroy();
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        if (this.isInterval) {
          this.destroy();
        }
      },
    );
  }
  private destroy() {
    if (this.isInterval) {
      this.intervalData.unsubscribe();
    }
    this.isInterval = false;
  }
  private setInterval() {
    this.isInterval = true;
    this.intervalData = interval(13000).subscribe(() => {
      this.getLog(this.currentPage, this.paginationPageSize, false);
    });
  }
  onLog() {
    if (this.isInterval) {
      this.getLog(this.currentPage, this.paginationPageSize, false);
    } else {
      this.getLog(this.currentPage, this.paginationPageSize, false);
    }
  }
  setSort() {
    this.gridLogColumnApi.applyColumnState({
      state: [
        {
          colId: 'jobInfoId',
          sort: 'desc',
        },
      ],
      defaultState: { sort: null },
    });
  }
  updateLog(updateData: any) {
    const itemsToUpdate = [];
    const itemsToAdd = [];
    const dataLogDisplay = this.gridLogApi.getModel();
    dataLogDisplay.forEachNode((node, index) => {
      if (
        node.data.status !== 'Failed' &&
        node.data.status !== 'ReportFailed' &&
        node.data.status !== 'Canceled' &&
        node.data.status !== 'Completed'
      ) {
        const updateDataIndex = updateData.findIndex(
          (obj) => obj.jobInfoId === node.data.jobInfoId,
        );
        if (updateDataIndex >= 0) {
          node.data.status = updateData[updateDataIndex].status;
          node.data.totalRow = updateData[updateDataIndex].totalRow;
          node.data.successRow = updateData[updateDataIndex].successRow;
          node.data.errorRow = updateData[updateDataIndex].errorRow;
          node.data.errorLog = updateData[updateDataIndex].errorLog;
          itemsToUpdate.push(node.data);
        } else {
          itemsToAdd.push(node.data);
        }
      }
    });
    if (itemsToAdd.length > 0) {
      this.gridLogApi.applyTransactionAsync({ add: itemsToAdd });
    } else if (itemsToUpdate.length > 0) {
      this.gridLogApi.applyTransactionAsync({ update: itemsToUpdate });
    }
  }

  onChange(event: any) {
    // console.log(this.selectList);
  }

  onGridLogReady(params: any) {
    // @ts-ignore
    this.gridLogApi = params.api;
    // @ts-ignore
    this.gridLogColumnApi = params.columnApi;
  }
}
