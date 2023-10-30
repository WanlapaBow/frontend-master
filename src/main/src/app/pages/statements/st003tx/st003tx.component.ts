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
import { debounceTime, tap } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';
import { SearchCustomerComponent } from '../../components/search-customer/search-customer.component';
import { defaultCofDef, setting, settingLine } from '../st003tx/ag-gird.config';
import { St003txService } from './st003tx.service';

@Component({
  selector: 'ngx-statement-print',
  templateUrl: './st003tx.component.html',
  styleUrls: ['./st003tx.component.scss'],
})
export class St003txComponent implements OnInit, AfterViewInit {
  @ViewChild('searchStatementNum', { static: true }) input: ElementRef;
  // flag
  isShowHeader: boolean = false;
  isLineShow: boolean = false;
  customerClassInvalid: boolean = false;
  loading: boolean = false;
  isStatementDisable: boolean = false;
  isCheckAll: boolean = false;
  // form
  form: FormGroup;
  // ag-grid
  rowData: any;
  lineData: any;
  rowSelection: string;
  paginationPageSize;
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
  // other
  statementNumberList$: Observable<string[]>;
  columnDefs = setting;
  defaultColDef = defaultCofDef;
  gridApiHeader: any;
  gridApiLine: any;
  tempHeader: any;
  columnLineDefs = settingLine;
  // other
  statementCheckBoxListTrue: any;
  sortingOrder: any;
  // pagination statement
  isStatementFirstPage: boolean = false;
  isStatementLastPage: boolean = false;
  statementTotalPages;
  statementPageSize;
  detailTotalPages;
  isDetailFirstPage: boolean = false;
  isDetailLastPage: boolean = false;
  detailPageSize;

  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    private service: St003txService,
    private sidebarService: NbSidebarService,
  ) {
    this.rowSelection = 'single';
    this.paginationPageSize = 10;
    this.statementPageSize = 10;
    this.detailPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
    this.sidebarService.compact('menu-sidebar');
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
    this.isLineShow = false;
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
  }

  onGridReady(params) {
    this.gridApiHeader = params.api;
    // this.gridColumnApi = params.columnApi;
  }

  onGridReadyLine(params) {
    this.gridApiLine = params.api;
    // this.gridColumnApiLine = params.columnApi;
  }

  onPaginationChanged(event: any) {
    if (this.gridApiHeader) {
    }
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

  onSearchStatement() {
    this.loading = true;
    this.isShowHeader = true;
    this.lineData = [];
    this.isLineShow = false;
    this.getStatement(0, this.paginationPageSize);
  }

  onSelectionStatement(event: any) {
    this.isLineShow = true;
    const value = this.gridApiHeader.getSelectedRows()['0'];
    this.tempHeader = value;
    if (value.statementStatus === 'CANCELLED') {
      this.isStatementDisable = true;
    }
    this.getStatementLine(0, this.paginationPageSize);
  }

  onStatementCheckAll() {
    const itemUpdate = [];
    this.isCheckAll = !this.isCheckAll;
    this.rowData.forEach((node) => {
      const temp = node;
      if (node.isCheck !== this.isCheckAll) {
        temp.isCheck = this.isCheckAll;
      }
      itemUpdate.push(temp);
    });
    this.gridApiHeader.applyTransaction({ update: itemUpdate });
    this.onCellValueChanged(null);
  }

  onCellValueChanged(event) {
    const dataCheck = this.rowData.filter((x) => x.isCheck === true);
    this.statementCheckBoxListTrue = dataCheck.map((item) => item.statementId);
  }

  onExport(type: string) {
    console.info(this.statementCheckBoxListTrue);
    switch (type) {
      case 'PDF':
        // code block
        break;
      case 'EXCEL':
        // code block
        break;
      case 'EMAIL':
        // code block
        break;
      default:
      // code block
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

  onCustomerClassChange() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
    this.form.get('customerCode').setValue('');
  }

  onPageSizeChanged(event: any) {
    this.gridApiHeader.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getStatement(event.currentPage, event.paginationPageSize);
    this.statementPageSize = event.paginationPageSize;
  }

  onBt(event: any) {
    this.statementPageSize = event.paginationPageSize;
    this.getStatement(event.currentPage, event.paginationPageSize);
  }
  // detail
  onDetailPageSizeChanged(event: any) {
    this.gridApiLine.paginationSetPageSize(Number(event.paginationPageSize));
    this.paginationPageSize = Number(event.paginationPageSize);
    this.getStatementLine(event.currentPage, event.paginationPageSize);
    this.detailPageSize = event.paginationPageSize;
  }

  onDetailBt(event: any) {
    this.detailPageSize = event.paginationPageSize;
    this.getStatementLine(event.currentPage, event.paginationPageSize);
  }

  private getStatement(index, limitPerPage) {
    this.service
      .getSearchStatement(this.form.value, limitPerPage, index)
      .subscribe(
        (result) => {
          if (
            result['status'] === 'OK' &&
            result['payload'].content.length > 0
          ) {
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
            this.statementTotalPages = result['payload'].totalPages;
          } else if (result['status'] === 'NOT_FOUND') {
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
          this.toastrService.show(error.message, error.payload, {
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

  private getStatementLine(index, limitPerPage) {
    this.service
      .getLine(this.tempHeader, limitPerPage, index)
      .subscribe((line) => {
        if (line['status'] === 'OK' && line['payload'].content) {
          this.lineData = line['payload'].content;
          this.detailTotalPages = line['payload'].totalPages;
          this.isDetailFirstPage = line['payload'].first;
          this.isDetailLastPage = line['payload'].last;
          // this.selectAllCheck();
          this.toastrService.show(
            this.toastrMsg.searchSuccess.message,
            this.toastrMsg.searchSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
            },
          );
        }
      });
  }

  onClearInput() {
    this.form.get('customerName').setValue('');
    this.form.get('siteNumber').setValue('');
  }
}
