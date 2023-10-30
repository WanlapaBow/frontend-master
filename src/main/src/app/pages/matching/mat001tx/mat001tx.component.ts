import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NbDialogService,
  NbSidebarService,
  NbToastrService,
  NbToastRef,
} from '@nebular/theme';
import { fromEvent, interval, Observable, Subscription } from 'rxjs';
import {debounceTime, take, tap} from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import { defaultCofDef, logSetting } from './ag-gird.config';
import { Mat001txService } from './mat001tx.service';

@Component({
  selector: 'ngx-mat001tx',
  templateUrl: './mat001tx.component.html',
  styleUrls: ['./mat001tx.component.scss'],
})
export class Mat001txComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchStatementNum', { static: true }) input: ElementRef;
  form: FormGroup;
  customerClassInvalid: boolean = false;
  loading: boolean = false;
  statementNumberList$: Observable<string[]>;
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
  // @ts-ignore
  columnLogDefs: any;
  // @ts-ignore
  defaultColDef: any;
  logData: any;
  paginationPageSize: any;
  gridLogApi: any;
  gridLogColumnApi: any;
  sortingOrder: any;
  isLogLoading: boolean = false;
  currentPage: any = 0;
  totalPages: any = 0;
  isFirstPage: boolean = false;
  isLastPage: boolean = false;
  isInterval: any = false;
  intervalData: Subscription;
  tempLogData: any;

  constructor(
    public commonService: CommonService,
    private dialogService: NbDialogService,
    private sidebarService: NbSidebarService,
    private toastrService: NbToastrService,
    private service: Mat001txService,
  ) {
    this.sidebarService.compact('menu-sidebar');
    this.paginationPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
    this.columnLogDefs = logSetting;
    this.defaultColDef = defaultCofDef;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      customerClass: new FormControl({ value: '', disabled: false }),
      customerSubClass: new FormControl({ value: '', disabled: false }),
      customerName: new FormControl({ value: '', disabled: false }),
      siteNumber: new FormControl({ value: '', disabled: false }),
      customerCode: new FormControl({ value: '', disabled: false }),
      statementNumber: new FormControl({ value: '', disabled: false }),
      receiptDate: new FormControl({ value: '', disabled: false }),
      receiptMethod: new FormControl({ value: '', disabled: false }),
    });
    this.getLog(this.currentPage, this.paginationPageSize);
  }
  ngOnDestroy() {
    this.destroy();
  }
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getStatementNumber();
        }),
      )
      .subscribe();
  }

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  onClearStatement() {
    this.form.get('statementNumber').setValue('');
  }

  isShowSubClass: boolean = false;
  customerSubClassList: any = [];
  onCustomerClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('customerSubClass').setValue('');
    if (this.form.value.customerClass === 'INHOUSE' || this.form.value.customerClass === 'KBANK') {
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
      // this.checkInhouse = true;
    } else {
      this.isShowSubClass = false;
      // this.checkInhouse = false;
    }
  }

  onCustomerSubClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    // if (this.form.value.customerSubClass !== '') {
    //   this.checkInhouse = false;
    // }
  }

  onChangeCustomerClass() {
    this.customerClassInvalid = false;
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

  async onMatchingReceipt() {
    this.loading = true;
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
    await this.service.postMatching(this.form.value).then(
      (result: any) => {
        if (result['status'] === 'OK' && result.payload.length > 0) {
          this.onLog();
          toastRef.close();
          this.loading = false;
        } else {
          this.toastrService.show(result.payload, result.status, {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
          });
          toastRef.close();
          this.loading = false;
        }
      },
      (error) => {
        toastRef.close();
        this.toastrService.show(error.message, error.payload, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
        this.loading = false;
      },
    );
  }

  clear() {
    this.form.reset();
    this.customerClassInvalid = false;
    this.form.get('status').setValue('CONFIRMED');
    this.form.get('businessUnit').setValue('');
    this.form.get('customerClass').setValue('');
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('statementNumber').setValue('');
    this.form.get('receiptDate').setValue(new Date());
    this.form.get('customerSubClass').setValue('');
    this.isShowSubClass = false;
  }

  getStatementNumber() {
    this.commonService
      .getStatementNumber$(this.form.value.statementNumber)
      .pipe(debounceTime(5000))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  onGridLogReady(params: any) {
    this.gridLogApi = params.api;
    this.gridLogColumnApi = params.columnApi;
  }

  async onPageSizeChanged(event: any) {
    // this.isInterval = false;
    await this.destroy();
    this.gridLogApi.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    // this.getLog(event.currentPage, event.paginationPageSize);
    await this.onLog();
    this.currentPage = event.currentPage;
    this.paginationPageSize = event.paginationPageSize;
  }

  async onBt(event: any) {
    // this.isInterval = false;
    await this.destroy();
    this.paginationPageSize = event.paginationPageSize;
    this.currentPage = event.currentPage;
    // this.getLog(event.currentPage, event.paginationPageSize);
    await this.onLog();
  }

  onLog() {
    if (this.isInterval) {
      this.getLog(this.currentPage, this.paginationPageSize);
    } else {
      this.getLog(this.currentPage, this.paginationPageSize);
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
    const datas = this.gridLogApi.getModel();
    const dataLogDisplay = datas.rowsToDisplay;
    updateData.forEach((node) => {
      const tempDisplay = dataLogDisplay.filter(
        (x) => x.data.jobInfoId === node.jobInfoId,
      );
      if (tempDisplay.length > 0) {
        const data = tempDisplay[0].data;
        data.requestId = node.requestId;
        data.jobInfoStatus = node.jobInfoStatus;
        data.totalInvoices = node.totalInvoices;
        data.successStatement = node.successStatement;
        data.endProcessing = node.endProcessing;
        itemsToUpdate.push(data);
      } else {
        itemsToAdd.push(node);
      }
    });
    if (itemsToAdd.length > 0) {
      this.gridLogApi.applyTransactionAsync({ add: itemsToAdd });
    } else if (itemsToUpdate.length > 0) {
      this.gridLogApi.applyTransactionAsync({ update: itemsToUpdate });
    }
  }

  private setInterval() {
    this.isInterval = true;
    this.intervalData = interval(13000).subscribe((x) => {
      this.getLog(this.currentPage, this.paginationPageSize);
    });
  }

  private getLog(index, limit) {
    this.service.getLog(index, limit).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          if (this.isInterval) {
            this.tempLogData = res['payload'].content;
            if (this.gridLogApi.getDisplayedRowCount() > 0) {
              this.updateLog(this.tempLogData);
            }
          } else {
            this.logData = res['payload'].content;
            this.setSort();
            this.setInterval();
          }
          this.totalPages = res['payload'].totalPages;
          this.isLastPage = res['payload'].last;
          this.isFirstPage = res['payload'].first;
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
}
