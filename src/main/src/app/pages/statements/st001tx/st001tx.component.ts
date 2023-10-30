import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NbDialogService,
  NbSidebarService,
  NbToastrService,
  NbToastRef,
} from '@nebular/theme';
import { saveAs } from 'file-saver';
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { CommonService } from '../../../_helpers/common.service';
import { UtilsService } from '../../../_helpers/utils.service';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import { defaultCofDef, logSetting } from './ag-gird.config';
import { St001txSelectEmailSenderComponent } from './st001tx-select-email-sender/st001tx-select-email-sender.component';
import { St001txService } from './st001tx.service';

@Component({
  selector: 'ngx-statements-create',
  templateUrl: './st001tx.component.html',
  styleUrls: ['./st001tx.component.scss'],
})
export class St001txComponent implements OnInit, OnDestroy {
  pageTitle: string = 'Create Statement';
  defaultColDef = defaultCofDef;
  rowSelection;
  paginationPageSize;
  // Action variable
  loading: boolean = false;
  isShowResult: boolean = false;
  isShowSubClass: boolean = false;
  // isloading: boolean = false;
  isInterval: boolean = false;
  paymentPeriodList: any = [];
  customerSubClassList: any = [];
  form: FormGroup;
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
  customerClassInvalid: boolean = false;
  checkInhouse: boolean = true;
  sortingOrder: any;
  private gridApi;
  // Log
  isLogLoading: boolean = false;
  columnLogDefs = logSetting;
  logData: any[] = [];
  // @ts-ignore
  gridLogApi: any;
  // @ts-ignore
  gridLogColumnApi: any;
  intervalData: any;
  isShowLog: boolean = true;
  tempLogData: any;
  currentPage: any = 0;
  context;

  routeSubscribe: Subscription;
  routeData: any;

  constructor(
    public commonService: CommonService,
    private service: St001txService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private sidebarService: NbSidebarService,
    private route: ActivatedRoute,
  ) {
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
    this.sidebarService.compact('menu-sidebar');
  }

  ngOnInit(): void {
    this.routeSubscribe = this.route.data.subscribe((data) => {
      this.routeData = data;
    });

    if (this.routeData.role === 'admin') {
      this.pageTitle = this.pageTitle.concat(' [ADMIN]');
      this.form = new FormGroup({
        businessUnit: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        customerClass: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        customerSubClass: new FormControl({ value: '', disabled: false }),
        customerName: new FormControl({ value: '', disabled: false }),
        siteNumber: new FormControl({ value: '', disabled: false }),
        customerCode: new FormControl({ value: '', disabled: false }),
        periodCode: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        paymentCalendar: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        paymentPeriod: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        invoiceStartDueDate: new FormControl({ value: '', disabled: true }),
        invoiceEndDueDate: new FormControl({ value: '', disabled: true }),
        paymentDueDate: new FormControl({ value: '', disabled: true }),
        sendEmail: new FormControl({ value: false, disabled: false }),
        emailSenderId: new FormControl({ value: '', disabled: false }),
      });
    } else {
      this.form = new FormGroup({
        businessUnit: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        customerClass: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        customerSubClass: new FormControl({ value: '', disabled: false }),
        customerName: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        siteNumber: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        customerCode: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        periodCode: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        paymentCalendar: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        paymentPeriod: new FormControl(
          { value: '', disabled: false },
          Validators.required,
        ),
        invoiceStartDueDate: new FormControl({ value: '', disabled: true }),
        invoiceEndDueDate: new FormControl({ value: '', disabled: true }),
        paymentDueDate: new FormControl({ value: '', disabled: true }),
        sendEmail: new FormControl({ value: false, disabled: false }),
        emailSenderId: new FormControl({ value: '', disabled: false }),
      });
    }
    this.context = { componentParent: this };
    this.getLog(this.currentPage, this.paginationPageSize, false);
  }
  ngOnDestroy() {
    this.routeSubscribe.unsubscribe();
    this.destroy();
  }

  isRequiredField(field: string) {
    const form_field = this.form.get(field);
    if (!form_field.validator) {
      return false;
    }

    const validator = form_field.validator({} as AbstractControl);
    return validator && validator.required;
  }

  onSelectPaymentCalendar() {
    this.form.get('paymentPeriod').setValue('');
    this.form.get('invoiceStartDueDate').setValue('');
    this.form.get('invoiceEndDueDate').setValue('');
    this.form.get('paymentDueDate').setValue('');

    this.commonService
      .getPaymentPeriodByCode$(this.form.value.paymentCalendar)
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.paymentPeriodList = response['payload'];
        },
        (err) => console.error(err),
      );
  }

  onSelectPaymentPeriod() {
    const param = {
      code: this.form.value.paymentCalendar,
      paymentPeriod: this.form.value.paymentPeriod,
    };
    this.commonService
      .getPaymentDueDateByCalendarAndCode$(param)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.payload) {
            this.form
              .get('invoiceStartDueDate')
              .setValue(
                new UtilsService().dateFormatddmmyyyy(
                  response.payload.periodStartDate,
                ),
              );
            this.form
              .get('invoiceEndDueDate')
              .setValue(
                new UtilsService().dateFormatddmmyyyy(
                  response.payload.periodEndDate,
                ),
              );
            this.form
              .get('paymentDueDate')
              .setValue(
                new UtilsService().dateFormatddmmyyyy(response.payload.dueDate),
              );
            this.form.get('periodCode').setValue(response.payload.periodCode);
          } else {
            this.toastrService.show(
              this.toastrMsg.noData.message,
              this.toastrMsg.noData.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
              },
            );
          }
        },
        (err) => console.error(err),
      );
  }

  onPaginationChanged() {
    if (this.gridApi) {
    }
  }

  clearData() {
    this.isShowResult = false;
    this.form.reset();
    this.form.get('sendEmail').setValue(false);
    this.customerClassInvalid = false;
    this.isShowSubClass = false;
  }

  onSubmit() {
    this.dialogService
      .open(St001txSelectEmailSenderComponent)
      .onClose.subscribe((data) => {
        if (data) {
          this.loading = true;
          this.isShowResult = true;
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
          this.form.get('emailSenderId').setValue(data.code);
          // console.log(this.form.value)
          this.service.postStatementCreate(this.form.value).subscribe(
            (result: any) => {
              if (result['status'] === 'OK' && result.payload.length > 0) {
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
                  this.loading = false;
                }, 1000);
              } else if (result['status'] === 'NOT_FOUND') {
                this.toastrService.show(result.payload, result.status, {
                  status: 'warning',
                  duration: 5000,
                  destroyByClick: true,
                });
                this.isShowResult = false;
                this.loading = false;
                toastRef.close();
                this.customerClassInvalid = false;
              } else if (result['status'] === 'VALIDATION_EXCEPTION') {
                this.service.getPdf(result.payload).subscribe((res) => {
                  if (res['blob'].size > 0) {
                    this.toastrService.show(
                      'โหลดข้อมูลขนาด ' +
                        this.commonService.bytesToSize(res['blob'].size),
                      'Log Download',
                      {
                        status: 'warning',
                        duration: 5000,
                      },
                    );
                    saveAs(res['blob'], res['filename']);
                    toastRef.close();
                  } else {
                    toastRef.close();
                    this.toastrService.show('ไม่พบข้อมูล', 'Log Download', {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                    });
                  }
                });
              }
              this.loading = false;
            },
            (error) => {
              toastRef.close();
              this.toastrService.show(error.message, error.payload, {
                status: 'danger',
                duration: 5000,
                destroyByClick: true,
              });
              this.customerClassInvalid = false;
              this.loading = false;
              this.isShowResult = false;
            },
          );
        }
      });
  }

  onSearch() {
    const isCheckSearchPopup = this.form.get('customerClass').valid;
    // let customerClass = '';
    // if (this.form.value.customerClass === 'INHOUSE') {
    //   customerClass = this.form.value.customerSubClass;
    // } else {
    //   customerClass = this.form.value.customerClass;
    // }
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
  // isShowSubClass: boolean = false;
  // customerSubClassList: any = [];
  onCustomerClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('customerSubClass').setValue('');
    if (
      this.form.value.customerClass === 'INHOUSE' ||
      this.form.value.customerClass === 'KBANK'
    ) {
      this.commonService
        .getCustomerSubClassSearch(this.form.value.customerClass)
        .pipe(take(1))
        .subscribe(
          (response: any[]) => {
            this.customerSubClassList = response['payload'];
          },
          (err) => console.error(err),
        );
      this.isShowSubClass = true;
      this.checkInhouse = true;
    } else {
      this.isShowSubClass = false;
      this.checkInhouse = false;
    }
  }

  onCustomerSubClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    if (this.form.value.customerSubClass !== '') {
      this.checkInhouse = false;
    }
  }

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  onGridLogReady(params: any) {
    // @ts-ignore
    this.gridLogApi = params.api;
    // @ts-ignore
    this.gridLogColumnApi = params.columnApi;
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
  private setInterval() {
    this.isInterval = true;
    this.intervalData = interval(13000).subscribe(() => {
      this.getLog(this.currentPage, this.paginationPageSize, false);
    });
  }
  private destroy() {
    if (this.isInterval) {
      this.intervalData.unsubscribe();
    }
    this.isInterval = false;
  }

  onLog() {
    this.isShowLog = true;
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

  totalPages: any = 0;
  isFirstPage: any;
  isLastPage: any;

  updateLog(updateData: any) {
    const itemsToUpdate = [];
    const itemsToAdd = [];
    const dataLogDisplay = this.gridLogApi.getModel();
    dataLogDisplay.forEachNode((node, index) => {
      if (
        node.data.jobInfoStatus !== 'Failed' &&
        node.data.jobInfoStatus !== 'ReportFailed' &&
        node.data.jobInfoStatus !== 'Canceled' &&
        node.data.jobInfoStatus !== 'Completed'
      ) {
        const updateDataIndex = updateData.findIndex(
          (obj) => obj.jobInfoId === node.data.jobInfoId,
        );
        if (updateDataIndex >= 0) {
          node.data.requestId = updateData[updateDataIndex].requestId;
          node.data.jobInfoStatus = updateData[updateDataIndex].jobInfoStatus;
          node.data.totalInvoices = updateData[updateDataIndex].totalInvoices;
          node.data.successStatement =
            updateData[updateDataIndex].successStatement;
          node.data.endProcessing = updateData[updateDataIndex].endProcessing;
          node.data.startImportDataProcessing =
            updateData[updateDataIndex].startImportDataProcessing;
          node.data.startCreateStatementProcessing =
            updateData[updateDataIndex].startCreateStatementProcessing;
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
  onPageSizeChanged(event: any) {
    this.gridLogApi.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getLog(event.currentPage, event.paginationPageSize, true);
    this.currentPage = event.currentPage;
    this.paginationPageSize = event.paginationPageSize;
  }
  onBt(event: any) {
    this.paginationPageSize = event.paginationPageSize;
    this.currentPage = event.currentPage;
    this.getLog(event.currentPage, event.paginationPageSize, true);
  }
  getPdfZip(cell) {
    const url =
      environment.apiUrl +
      'api/v1/schedule/statement/download?requestId=' +
      cell +
      '&docType=pdf&flag=';
    window.open(url);
  }
  getPdfZipKbank(cell) {
    const url =
      environment.apiUrl +
      'api/v1/schedule/statement/download?requestId=' +
      cell +
      '&docType=pdf&flag=KBANK';
    window.open(url);
  }
  getExcelZip(cell) {
    const url =
      environment.apiUrl +
      'api/v1/schedule/statement/download?requestId=' +
      cell +
      '&docType=excel&flag=';
    window.open(url);
  }
  getExcelZipKbank(cell) {
    const url =
      environment.apiUrl +
      'api/v1/schedule/statement/download?requestId=' +
      cell +
      '&docType=excel&flag=KBANK';
    window.open(url);
  }
  getLogEmail(requestId) {
    this.service.getLogEmail(requestId).subscribe(
      (res) => {
        if (res['blob'].size > 0) {
          saveAs(res['blob'], res['filename']);
        } else {
          this.toastrService.show(
            this.toastrMsg.noFile.message,
            this.toastrMsg.noFile.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
            },
          );
        }
      },
      (error) => {
        this.toastrService.show(error.message, error.payload, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
      },
    );
  }
}
