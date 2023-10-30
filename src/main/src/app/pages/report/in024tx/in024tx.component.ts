import {HttpParams} from '@angular/common/http';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NbDialogService, NbToastrService, NbToastRef} from '@nebular/theme';
import {interval} from 'rxjs';
import {CommonService} from '../../../_helpers/common.service';
import {SearchCustomerComponent} from '../../components/search-customer/search-customer.component';
import {defaultCofDef, logSetting} from '../in024tx/ag-gird.config';
import {In024txService} from './in024tx.service';

@Component({
  selector: 'ngx-in024tx',
  templateUrl: './in024tx.component.html',
  styleUrls: ['./in024tx.component.scss'],
})
export class In024txComponent implements OnInit {
  @ViewChild('searchStatementNum', {static: true}) inputStatementNum: ElementRef;
  @ViewChild('searchTaxInvoiceNum', {static: true}) inputTaxInvoiceNum: ElementRef;
  form: FormGroup;
  isLoading: boolean = false;
  customerClassInvalid: boolean = false;
  context;
  private gridApi;
  gridLogApi: any;
  gridLogColumnApi: any;
  sortingOrder: any;
  logData: any[] = [];
  gridOptions = {
    animateRows: true,
    enableSorting: true,
    enableCellChangeFlash: true,
    onGridReady: params => {
      params.api.sizeColumnsToFit();
    },
  };
  isInterval: boolean = false;
  tempLogData: any;
  intervalData: any;
  currentPage: any = 0;
  paginationPageSize: any = 10;
  toastrMsg = {
    waiting: {
      message: 'กำลังค้นหาข้อมูล',
      title: 'กำลังค้นหา',
    },
    noData: {
      message: 'ไม่พบข้อมูล',
      title: 'ไม่พบข้อมูล',
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
  totalPages: any = 0;
  isFirstPage: any;
  isLastPage: any;
  columnLogDefs = logSetting;
  checked = false;
  defaultColDef = defaultCofDef;

  toggle(checked: boolean) {
    this.checked = checked;
  }

  constructor(public commonService: CommonService,
              public service: In024txService,
              private dialogService: NbDialogService,
              private toastrService: NbToastrService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl({value: '', disabled: false}, Validators.required),
      customerClass: new FormControl({value: '', disabled: false}, Validators.required),
      customerSubClass: new FormControl({ value: '', disabled: false }),
      customerName: new FormControl({value: '', disabled: false}),
      siteNumber: new FormControl({value: '', disabled: false}),
      customerCode: new FormControl({value: '', disabled: false}),
    });
    this.context = { componentParent: this };
    this.getLog(this.currentPage, 10000, false);
  }
  exportReport() {
    this.isLoading = true;
    const toastRef: NbToastRef = this.toastrService.show(
      'กำลังเตรียมข้อมูล',
      'Loading',
      {
        icon: 'loader-outline',
        limit: 1,
        status: 'warning',
        destroyByClick: false,
        duration: 0,
      },
    );
    if (this.isInterval) {
      this.destroy();
    }
    this.service.getGenerate(this.form.value)
      .subscribe((result: any) => {
          if (result['status'] === 'OK') {
            this.onLog();
            // this.rowData = result.payload;
            toastRef.close();
            this.toastrService.show(
              this.toastrMsg.searchSuccess.message,
              this.toastrMsg.searchSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
          }
          this.isLoading = false;
          this.clearData();
        },
        (error) => {
          toastRef.close();
          this.toastrService.show(error.message, error.payload, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
          this.isLoading = false;
        },
      );
  }

  onChangeCustomerClass() {
    this.customerClassInvalid = false;
  }
  onCustomerClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
  }
  onSearchCustomer() {
    const isCheckSearchPopup = this.form.get('customerClass').valid;
    if (isCheckSearchPopup) {
      this.dialogService
        .open(SearchCustomerComponent, {
          context: {
            customerClass: this.form.value.customerClass,
            customerSubClass: this.form.value.customerSubClass,
          },
        })
        .onClose.subscribe((data) => {
        if (data) {
          this.form.get('customerName').setValue(data.customerName);
          this.form.get('siteNumber').setValue(data.siteNumber);
          this.form.get('customerCode').setValue(data.customerCode);
        }
      });
    } else {
      this.customerClassInvalid = true;
    }
  }
  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  private getLog(index, limit, flagPage) {
    this.service.getLog(index, limit).subscribe(
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
      if (node.data.jobInfoStatus !== 'Failed' && node.data.jobInfoStatus !== 'ReportFailed' && node.data.jobInfoStatus !== 'Canceled' && node.data.jobInfoStatus !== 'Completed') {
        const updateDataIndex = updateData.findIndex((obj) => obj.jobInfoId === node.data.jobInfoId);
        if (updateDataIndex >= 0) {
          node.data.requestId = updateData[updateDataIndex].requestId;
          node.data.jobInfoStatus = updateData[updateDataIndex].jobInfoStatus;
          node.data.endProcessing = updateData[updateDataIndex].endProcessing;
          node.data.startProcessing = updateData[updateDataIndex].startProcessing;
          node.data.expiryDate = updateData[updateDataIndex].expiryDate;
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
  onGridReady(params) {
    this.gridApi = params.api;
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
  methodFromParent(cell) {
    const params = new HttpParams()
      .set('requestId', cell)
      .set('reportName', 'OutStandingReport');
    this.service.getDownloadXlsx(params);
  }


  clearData() {
    this.form.reset();
    this.customerClassInvalid = false;
  }
}
