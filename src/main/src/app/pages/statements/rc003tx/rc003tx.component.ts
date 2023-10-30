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
  NbMenuService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { saveAs } from 'file-saver';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime, filter, map, take, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import { SelectDateComponent } from '../../components/select-date/select-date.component';
import { defaultColDef, setting, settingReceipt } from './ag-grid.config';
import { Rc003txService } from './rc003tx.service';

@Component({
  selector: 'ngx-rc003tx',
  templateUrl: './rc003tx.component.html',
  styleUrls: ['./rc003tx.component.scss'],
})
export class Rc003txComponent implements OnInit, AfterViewInit {
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
  private gridHeaderApi: any;
  // @ts-ignore
  gridReceiptAdvApi: any;
  something: boolean = false;

  buttonCheck: any = {
    enableCreateAdvReceiptButton: false,
    enableCancelAdvReceiptButton: false,
    enableReprintAdvReceiptButton: false,
    enableCreateAdvReceiptGroupButton: false,
    enableReprintAdvReceiptGroupButton: false,
  };
  items = [];
  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private service: Rc003txService,
    private sidebarService: NbSidebarService,
    private nbMenuService: NbMenuService,
  ) {
    this.sidebarService.compact('menu-sidebar');
    this.columnDefs = setting;
    this.columnReciptDefs = settingReceipt;
    this.defaultColDef = defaultColDef;
    this.sortingOrder = ['desc', 'asc'];
    this.rowSelection = 'single';
    this.paginationPageSize = 10;
  }
  private menu: Subscription;

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
      advReceiptDate: new FormControl({ value: '', disabled: false }),
    });
    this.setMenu();
    this.menu = this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'download-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe((title) => {
        switch (title) {
          case 'DOWNLOAD PDF':
            this.onDownloadPdf();
            break;
          case 'DOWNLOAD PDF (GROUP)':
            this.onDownloadPdfForCheque();
            break;
          case 'CREATE ADVANCE RECEIPT':
            this.onCreateReceiptAdv();
            break;
          case 'CREATE (GROUP)':
            this.onCreateReceiptAdvGroup();
            break;
          case 'CANCEL ADVANCE RECEIPT':
            this.onCancelReceiptAdv();
            break;
        }
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
    // this.isShowInvoice = false;
    this.rowData = [];
    this.lineData = [];
    // this.invoiceData = [];
    this.form.reset();
    this.customerClassInvalid = false;
    this.form.get('status').setValue('CONFIRMED');
    this.form.get('businessUnit').setValue('');
    this.form.get('customerClass').setValue('');
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
    this.form.get('statementNumber').setValue('');
    this.form.get('advancedReceiptDate').setValue('');
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
    this.getStatement();
  }

  onSelectionStatement(event: any) {
    this.isReceiptLoading = true;
    this.isReceiptAdvShow = true;
    const value = this.gridHeaderApi.getSelectedRows()['0'];
    this.tempHeader = value;
    this.getRecieptAdvance();
  }

  onCreateReceiptAdv() {
    this.dialogService.open(SelectDateComponent).onClose.subscribe((data) => {
      if (data) {
        this.isReceiptLoading = true;
        const params = {
          statementNumber: this.tempHeader.statementNumber,
          advReceiptDate: data.date,
          flagCreate: 'normal',
        };
        this.service.postReceiptAdvCreate(params).subscribe((res) => {
          if (res['status'] === 'OK') {
            this.toastrService.show(
              this.toastrMsg.saveSuccess.message,
              this.toastrMsg.saveSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
            this.getStatementDetail();
            this.getRecieptAdvance();
          } else if (res['status'] === 'NOT_FOUND') {
            this.toastrService.show(
              this.toastrMsg.error.message,
              this.toastrMsg.error.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
              },
            );
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
          } else if (res['status'] === 'BAD_REQUEST') {
            this.toastrService.show(
              this.toastrMsg.error.message,
              this.toastrMsg.error.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
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
              },
            );
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
          }
        });
      }
    });
  }

  onCreateReceiptAdvGroup() {
    this.dialogService
      .open(SearchCustomerComponent, {
        context: {
          customerClass: 'ALL',
          customerSubClass: '',
        },
      })
      .onClose.subscribe((data) => {
        if (data) {
          // this.form.get('customerName').setValue(data.customerName);
          // this.form.get('siteNumber').setValue(data.siteNumber);
          // this.form.get('customerCode').setValue(data.customerCode);
          this.dialogService
            .open(SelectDateComponent)
            .onClose.subscribe((dataDate) => {
              if (dataDate) {
                this.isReceiptLoading = true;
                const params = {
                  statementNumber: this.tempHeader.statementNumber,
                  flagCreate: 'group',
                  siteNumber: data.siteNumber,
                  customerCode: data.customerCode,
                  customerName: data.customerName,
                  advReceiptDate: dataDate.date,
                };
                this.service.postReceiptAdvCreate(params).subscribe((res) => {
                  if (res['status'] === 'OK') {
                    this.toastrService.show(
                      this.toastrMsg.saveSuccess.message,
                      this.toastrMsg.saveSuccess.title,
                      {
                        status: 'success',
                        duration: 5000,
                        destroyByClick: true,
                      },
                    );
                    setTimeout(() => {
                      this.isReceiptLoading = false;
                    }, 1000);
                    this.getStatementDetail();
                    this.getRecieptAdvance();
                  } else if (res['status'] === 'NOT_FOUND') {
                    this.toastrService.show(
                      this.toastrMsg.error.message,
                      this.toastrMsg.error.title,
                      {
                        status: 'warning',
                        duration: 5000,
                        destroyByClick: true,
                      },
                    );
                    setTimeout(() => {
                      this.isReceiptLoading = false;
                    }, 1000);
                  } else if (res['status'] === 'BAD_REQUEST') {
                    this.toastrService.show(
                      this.toastrMsg.error.message,
                      this.toastrMsg.error.title,
                      {
                        status: 'warning',
                        duration: 5000,
                        destroyByClick: true,
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
                      },
                    );
                    setTimeout(() => {
                      this.isReceiptLoading = false;
                    }, 1000);
                  }
                });
              }
            });
        }
      });
  }

  onCancelReceiptAdv() {
    this.isReceiptLoading = true;
    const params = {
      statementNumber: this.tempHeader.statementNumber,
    };
    this.service.postReceiptAdvCancel(params).subscribe((res) => {
      if (res['status'] === 'OK') {
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
          this.isReceiptLoading = false;
        }, 1000);
        this.getStatementDetail();
        this.getRecieptAdvance();
      } else if (res['status'] === 'NOT_FOUND') {
        this.toastrService.show(
          this.toastrMsg.error.message,
          this.toastrMsg.error.title,
          {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
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
    this.service.getDownloadPdf(this.tempHeader.statementNumber).subscribe(
      (res) => {
        if (res.status === 200) {
          saveAs(res.body, 'ADVANCE_RECEIPT.pdf');
          setTimeout(() => {
            this.isReceiptLoading = false;
          }, 1000);
        } else if (res.status === 204) {
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
            },
          );
          setTimeout(() => {
            this.isReceiptLoading = false;
          }, 1000);
        }
      },
      (error) => {
        if (error.status === 404) {
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
          setTimeout(() => {
            this.isReceiptLoading = false;
          }, 1000);
        } else {
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
          setTimeout(() => {
            this.isReceiptLoading = false;
          }, 1000);
        }
      },
    );
  }

  onDownloadPdfForCheque() {
    this.isReceiptLoading = true;
    this.service
      .getDownloadPdfForCheque(this.tempHeader.statementNumber)
      .subscribe(
        (res) => {
          if (res.status === 200) {
            saveAs(res.body, 'ADVANCE_RECEIPT.pdf');
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
          } else if (res.status === 204) {
            this.toastrService.show(
              this.toastrMsg.noData.message,
              this.toastrMsg.noData.title,
              {
                status: 'warning',
                duration: 5000,
                destroyByClick: true,
              },
            );
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
          }
        },
        (error) => {
          if (error.status === 404) {
            this.toastrService.show(error.message, this.toastrMsg.error.title, {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
            });
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
          } else {
            this.toastrService.show(error.message, this.toastrMsg.error.title, {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
            });
            setTimeout(() => {
              this.isReceiptLoading = false;
            }, 1000);
          }
        },
      );
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

  private getRecieptAdvance() {
    this.something = false;
    this.service.getReceiptAdv(this.tempHeader.statementNumber).subscribe(
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
          this.getButtonCheck(this.tempHeader.statementNumber);
        } else if (
          line['status'] === 'OK' &&
          line['payload'].length === 0 &&
          this.tempHeader.statementStatus !== 'CANCELLED'
        ) {
          this.buttonCheck.enableCreateAdvReceiptButton = true;
          this.buttonCheck.enableCreateAdvReceiptGroupButton = true;
          this.buttonCheck.enableCancelAdvReceiptButton = false;
          this.buttonCheck.enableReprintAdvReceiptButton = false;
          this.buttonCheck.enableReprintAdvReceiptGroupButton = false;
          this.setMenu();
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
        } else if (
          line['status'] === 'OK' &&
          line['payload'].length === 0 &&
          this.tempHeader.statementStatus === 'CANCELLED'
        ) {
          this.buttonCheck.enableCreateAdvReceiptButton = false;
          this.buttonCheck.enableCreateAdvReceiptGroupButton = false;
          this.buttonCheck.enableCancelAdvReceiptButton = false;
          this.buttonCheck.enableReprintAdvReceiptButton = false;
          this.buttonCheck.enableReprintAdvReceiptGroupButton = false;
          this.setMenu();
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
        } else if (line['status'] === 'NOT_FOUND') {
          this.clearButtonCheck();
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
          this.clearButtonCheck();
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
        this.clearButtonCheck();
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
        this.isReceiptLoading = false;
      },
    );
  }

  private getStatement() {
    this.isShowHeader = true;
    this.lineData = [];
    this.isReceiptAdvShow = false;
    this.service.getSearchStatement(this.form.value).subscribe(
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
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
  private getStatementDetail() {
    this.service
      .getStatementDetail(this.tempHeader.statementId)
      .subscribe((result) => {
        if (result['payload'] && result['status'] === 'OK') {
          const dataUpdate = result['payload'];
          this.rowData.forEach((node, index) => {
            if (node.statementId === this.tempHeader.statementId) {
              this.tempHeader = dataUpdate;
              this.gridHeaderApi.getRowNode(index).setData(dataUpdate);
            }
          });
        }
      });
  }

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }

  onClearStatementNumber() {
    this.form.get('statementNumber').setValue('');
  }

  private getButtonCheck(statementNumber) {
    this.service.getButton(statementNumber).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.buttonCheck = res['payload'];
          this.setMenu();
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
  private clearButtonCheck() {
    this.buttonCheck = {
      enableCreateAdvReceiptButton: false,
      enableCancelAdvReceiptButton: false,
      enableReprintAdvReceiptButton: false,
      enableCreateAdvReceiptGroupButton: false,
      enableReprintAdvReceiptGroupButton: false,
    };
  }

  private setMenu() {
    this.items = [];
    if (this.buttonCheck.enableCreateAdvReceiptButton) {
      this.items.push({
        title: 'CREATE ADVANCE RECEIPT',
        icon: 'upload-outline',
      });
    }
    if (this.buttonCheck.enableCreateAdvReceiptGroupButton) {
      this.items.push({ title: 'CREATE (GROUP)', icon: 'upload-outline' });
    }
    if (this.buttonCheck.enableReprintAdvReceiptButton) {
      this.items.push({ title: 'DOWNLOAD PDF', icon: 'download-outline' });
    }
    if (this.buttonCheck.enableReprintAdvReceiptGroupButton) {
      this.items.push({
        title: 'DOWNLOAD PDF (GROUP)',
        icon: 'download-outline',
      });
    }
    if (this.buttonCheck.enableCancelAdvReceiptButton) {
      this.items.push({
        title: 'CANCEL ADVANCE RECEIPT',
        icon: 'close-outline',
      });
    }
    this.something = true;
  }
}
