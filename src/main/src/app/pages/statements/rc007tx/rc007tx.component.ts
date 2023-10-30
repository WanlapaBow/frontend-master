import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NbDialogService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import { defaultCol, setting, settingReceipt } from './ag-agrid.config';
import { Rc007txService } from './rc007tx.service';

@Component({
  selector: 'ngx-rc007tx',
  templateUrl: './rc007tx.component.html',
  styleUrls: ['./rc007tx.component.scss'],
})
export class Rc007txComponent implements OnInit, AfterViewInit {
  @ViewChild('searchStatementNum', { static: true }) input: ElementRef;
  form: FormGroup;
  // flag
  customerClassInvalid: boolean = false;
  isShowHeader: boolean = false;
  loading: boolean = false;
  isReceiptAdvShow: boolean = false;
  isReceiptLoading: boolean = false;
  // ag-grid
  rowSelection;
  paginationPageSize;
  lineData: any[];
  rowData: any[];
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
  };
  // param
  statementNumberList$: Observable<string[]>;
  // @ts-ignore
  columnDefs;
  // @ts-ignore
  defaultColDef;
  columnReciptDefs: any;
  // other
  tempHeader: any;
  sortingOrder: any;
  page: string;
  private gridHeaderApi: any;
  // @ts-ignore
  private gridReceiptAdvApi: any;
  buttonCheck: any = {
    enableCreateAdvWhtCertButton: false,
    enableCancelAdvWhtCertButton: false,
    enableReprintAdvWhtCertButton: false,
  };

  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private service: Rc007txService,
    private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.compact('menu-sidebar');
    this.columnDefs = setting;
    this.columnReciptDefs = settingReceipt;
    this.defaultColDef = defaultCol;
    this.sortingOrder = ['desc', 'asc'];
    this.rowSelection = 'single';
    this.paginationPageSize = 10;
  }

  ngOnInit(): void {
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
      statementNumber: new FormControl({ value: '', disabled: false }),
      status: new FormControl(
        { value: 'CONFIRMED', disabled: false },
        Validators.required,
      ),
    });
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

  clear() {
    this.isShowHeader = false;
    this.isReceiptAdvShow = false;
    this.rowData = [];
    this.lineData = [];
    this.form.reset();
    this.customerClassInvalid = false;
    this.form.get('status').setValue('CONFIRMED');
    this.form.get('businessUnit').setValue('');
    this.form.get('customerClass').setValue('');
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('statementNumber').setValue('');
    this.form.get('customerSubClass').setValue('');
    this.isShowSubClass = false;
  }

  onGridReady(params) {
    this.gridHeaderApi = params.api;
    // this.gridColumnApi = params.columnApi;
  }

  onChangeCustomerClass() {
    this.customerClassInvalid = false;
  }

  onPaginationChanged(event) {
    if (this.gridHeaderApi) {
    }
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

  getStatementNumber() {
    this.commonService
      .getStatementNumber$(this.form.value.statementNumber)
      .pipe(debounceTime(5000))
      .subscribe((response) => {
        this.statementNumberList$ = response.payload;
      });
  }

  onSearchStatement() {
    this.loading = true;
    this.isShowHeader = true;
    this.lineData = [];
    this.isReceiptAdvShow = false;
    this.getStatement();
  }

  onSelectionStatement(event: any) {
    this.isReceiptLoading = true;
    this.isReceiptAdvShow = true;
    this.tempHeader = event.data;
    this.getRecieptAdvance(false);
  }

  onCreateReceiptWhtAdv() {
    this.isReceiptLoading = true;
    this.loading = true;
    const params = {
      statementNumber: this.tempHeader.statementNumber,
      businessCode: this.form.value.businessUnit,
    };
    this.service.postReceiptAdvCreate(params).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.toastrService.show(
            this.toastrMsg.saveSuccess.message,
            this.toastrMsg.saveSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          setTimeout(() => {
            this.isReceiptLoading = false;
          }, 1000);
          // this.gridHeaderApi.applyTransaction({add: res['status'].content});
          this.getRecieptAdvance(true);
          this.getStatmentById();
          this.onDownloadPdf();
        } else if (res['status'] === 'NOT_FOUND') {
          this.toastrService.show(res['errors'], this.toastrMsg.error.title, {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          });
          setTimeout(() => {
            this.isReceiptLoading = false;
            this.loading = false;
          }, 1000);
        } else {
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          setTimeout(() => {
            this.isReceiptLoading = false;
            this.loading = false;
          }, 1000);
        }
      },
      (error) => {
        if (error.status === 404) {
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title + error.status,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        }
        this.loading = false;
        this.isReceiptLoading = false;
      },
    );
  }

  onCancelReceiptAdv() {
    this.isReceiptLoading = true;
    this.loading = true;
    const params = {
      statementNumber: this.tempHeader.statementNumber,
    };
    this.service.postWhtAdvCancel(params).subscribe((res) => {
      if (res['status'] === 'OK') {
        this.toastrService.show(
          this.toastrMsg.searchSuccess.message,
          this.toastrMsg.searchSuccess.title,
          {
            status: 'success',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          },
        );
        setTimeout(() => {
          this.isReceiptLoading = false;
        }, 1000);
        this.getRecieptAdvance(true);
        this.getStatmentById();
      } else if (res['status'] === 'NOT_FOUND') {
        this.toastrService.show(
          this.toastrMsg.error.message,
          this.toastrMsg.error.title,
          {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          },
        );
        setTimeout(() => {
          this.isReceiptLoading = false;
        }, 1000);
      } else {
        this.toastrService.show(
          this.toastrMsg.noData.message,
          this.toastrMsg.noData.title,
          {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          },
        );
        setTimeout(() => {
          this.isReceiptLoading = false;
        }, 1000);
      }
    });
  }

  onDownloadPdf() {
    this.isReceiptLoading = true;
    this.service.getDownloadPdf(this.tempHeader.statementNumber);
    setTimeout(() => {
      this.isReceiptLoading = false;
    }, 1000);
  }

  isShowSubClass: boolean = false;
  customerSubClassList: any = [];
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

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  async getStatement() {
    await this.service.getSearchStatement(this.form.value).subscribe(
      (result) => {
        if (result['payload'].content.length > 0) {
          this.toastrService.show(
            this.toastrMsg.searchSuccess.message,
            this.toastrMsg.searchSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
            },
          );
          this.rowData = result['payload'].content;
          setTimeout(() => {
            this.loading = false;
          }, 1000);
          // const tempIndex = this.rowData.findIndex(x => x.statementNumber === this.tempHeader.statementNumber);
          // if (tempIndex >= 0) {
          //   this.tempHeader = this.rowData[tempIndex];
          // }
          // this.originalStatementList = result['payload'].content;
        } else {
          this.rowData = [];
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
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        });
      },
    );
  }

  private async getRecieptAdvance(flag: any) {
    await this.service.getReceiptAdv$(this.tempHeader.statementNumber).then(
      (line) => {
        if (line['status'] === 'OK' && line['payload'].length > 0) {
          this.lineData = line['payload'];
          this.toastrService.show(
            this.toastrMsg.searchSuccess.message,
            this.toastrMsg.searchSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.isReceiptLoading = false;
          if (flag) {
            this.getStatmentById();
          }
        } else if (line['status'] === 'NOT_FOUND') {
          this.lineData = [];
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          this.isReceiptLoading = false;
        } else {
          this.isReceiptLoading = false;
          this.lineData = [];
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.isReceiptLoading = false;
      },
    );
    await this.getButtonCheck(this.tempHeader.statementNumber);
  }

  private getStatmentById() {
    this.service
      .getStatementById(this.tempHeader.statementId)
      .subscribe((res) => {
        if (res['status'] === 'OK') {
          const temp = res['payload'];
          this.tempHeader = temp;
          // const updateList = this.rowData.map((item) => {
          //   if (item.statementId === temp.statementId) {
          //     // update.push(temp);
          //     this.tempHeader = temp;
          //     return temp;
          //   } else {
          //     // update.push(item);
          //     return item;
          //   }
          // });
          const updateList = this.rowData;
          const index = this.rowData.findIndex(
            (x) => x.statementId === temp.statementId,
          );
          updateList[index] = temp;
          // console.log(updateList);
          this.gridHeaderApi.applyTransaction({ update: updateList });
          this.rowData = updateList;
          this.tempHeader = temp;
          this.loading = false;
        }
      });
  }

  private getButtonCheck(statementNumber) {
    this.service.getButton(statementNumber).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.buttonCheck = res['payload'];
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
