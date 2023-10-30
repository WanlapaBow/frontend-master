import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import {
  columnDefsEdit,
  columnDefsSubmit,
  defaultColDef,
  paginationPageSize,
  rowSelection,
} from './ag-grid.config';
import { In079txService } from './in079tx.service';

@Component({
  selector: 'ngx-in079tx',
  templateUrl: './in079tx.component.html',
  styleUrls: ['./in079tx.component.scss'],
})
export class In079txComponent implements OnInit {
  @ViewChild('searchAgentName', { static: true }) inputPartyName: ElementRef;
  @ViewChild('searchAgentNumber', { static: true })
  inputPartyNumber: ElementRef;
  @ViewChild('searchReceiptNumber', { static: true })
  inputReceiptNumber: ElementRef;
  @ViewChild('searchBankAccount', { static: true })
  inputBankAccount: ElementRef;
  form: FormGroup;
  receiptMethodList: any[];
  agentNameList$: Observable<string[]>;
  agentNumberList$: Observable<string[]>;
  receiptNumberList$: Observable<string[]>;
  propIdList$: Observable<string[]>;
  bankAccountList$: Observable<string[]>;

  private gridApi;
  gridColumnApi;
  formSizePage: FormGroup;

  rowData: any[] = [];
  columnDefsEdit = columnDefsEdit;
  columnDefsSubmit = columnDefsSubmit;
  defaultColDef = defaultColDef;
  rowSelection = rowSelection;
  paginationPageSize = paginationPageSize;
  currentPage = 0;
  totalPages;
  sizeList: any[] = ['10', '20', '50'];
  tooltipShowDelay = 0;

  isLoading: boolean = false;
  isShowEdit: boolean = false;
  isShowSubmit: boolean = false;

  submitData: any[] = [];

  tempStart: any;
  constructor(
    public service: In079txService,
    private toastrService: NbToastrService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      receiptMethod: new FormControl({ value: '', disabled: false }),
      agentName: new FormControl({ value: '', disabled: false }),
      agentNumber: new FormControl({ value: '', disabled: false }),
      receiptNumber: new FormControl({ value: '', disabled: false }),
      periodDate: new FormControl({ value: '', disabled: false }),
      propId: new FormControl({ value: '', disabled: false }),
      bankAccount: new FormControl({ value: '', disabled: false }),
      insuredName: new FormControl({ value: '', disabled: false }),
      receiptAmount: new FormControl({ value: '', disabled: false }),
    });
    this.formSizePage = new FormGroup({
      pageSize: new FormControl('10', Validators.required),
    });
    this.getReceiptMethod();
  }
  ngAfterViewInit() {
    fromEvent(this.inputPartyName.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getPartyName();
        }),
      )
      .subscribe();
    fromEvent(this.inputPartyNumber.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getPartyNumber();
        }),
      )
      .subscribe();
    fromEvent(this.inputReceiptNumber.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getReceiptNumber();
        }),
      )
      .subscribe();
    fromEvent(this.inputBankAccount.nativeElement, 'keyup')
      .pipe(
        debounceTime(1000),
        tap((event: KeyboardEvent) => {
          this.getBankAccount();
        }),
      )
      .subscribe();
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.getLog(this.currentPage, this.paginationPageSize);
  }

  // private getLog(index, limitPerPage) {
  //   this.service.getLog(index, limitPerPage).subscribe((responce: any) => {
  //     this.rowData = responce.payload.content;
  //     this.totalPages = responce.payload.totalPages;
  //   });
  // }

  getPropIdLog() {
    const toastRef = this.toastrService.show('waiting', 'Loading', {
      status: 'warning',
    });
    this.isLoading = true;
    const formData = {
      agentName: this.form.value.agentName,
      agentNumber: this.form.value.agentNumber,
      propId: this.form.value.propId,
      receiptDateFrom: this.form.value.periodDate.start,
      receiptDateTo: this.form.value.periodDate.end,
      receiptMethod: this.form.value.receiptMethod,
      receiptNumber: this.form.value.receiptNumber,
      bankAccount: this.form.value.bankAccount,
      insuredName: this.form.value.insuredName,
      receiptAmount: this.form.value.receiptAmount,
    };
    this.rowData = [];
    // console.log(this.form)
    this.service.getPropIdLog(formData).subscribe((responce: any) => {
      this.toastrService.show('waiting', 'Loading', {
        status: 'success',
        duration: 5000,
      });
      if (
        responce['status'] === 'OK' &&
        responce.payload !== undefined &&
        responce.payload.length > 0
      ) {
        this.isShowEdit = true;
        this.rowData = responce.payload;
        this.totalPages = responce.payload.totalPages;
        // } else if (responce['status'] === 'BAD_REQUEST') {
        //   alert('กรุณากรอก Parameter ให้ถูกต้อง');
      } else {
        alert('ไม่พบข้อมูล');
      }
      toastRef.close();
      this.isLoading = false;
    });
  }

  getReceiptMethod() {
    this.service.getReceiptMethod().subscribe(
      (response: any[]) => {
        this.receiptMethodList = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  getPartyName() {
    const params = new HttpParams()
      .set('partyName', this.form.value.agentName)
      .set('partyNumber', this.form.value.agentNumber);
    this.service.getPartyName(params).subscribe(
      (response: any[]) => {
        this.agentNameList$ = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  getPartyNumber() {
    const params = new HttpParams()
      .set('partyName', this.form.value.agentName)
      .set('partyNumber', this.form.value.agentNumber);
    this.service.getPartyNumber(params).subscribe(
      (response: any[]) => {
        this.agentNumberList$ = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  getReceiptNumber() {
    const params = new HttpParams().set(
      'receiptNumber',
      this.form.value.receiptNumber,
    );
    this.service.getReceiptNumber(params).subscribe(
      (response: any[]) => {
        this.receiptNumberList$ = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  getBankAccount() {
    const params = new HttpParams().set(
      'bankAccountName',
      this.form.value.bankAccount,
    );
    this.service.getBankAccount(params).subscribe(
      (response: any[]) => {
        this.bankAccountList$ = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  onCellEditStart($event: any) {
    this.tempStart = $event.node.data.currentPropId;
    // console.log(this.tempStart);
  }
  onCellEditStop($event: any) {
    if ($event.value === undefined) {
      $event.node.setDataValue('validPropId', '');
    } else if ($event.value.length < 10 || $event.value.length > 10) {
      alert('กรุณากรอกหมายเลข Prop ID ให้ถูกต้อง (10 Digits)');
      $event.node.setDataValue('validPropId', '');
    } else if ($event.value.length === 10 && $event.value !== this.tempStart) {
      const something = {
        newPropId: $event.value,
        oldPropId: $event.data.currentPropId,
        cashReceiptId: $event.data.cashReceiptId,
      };
      $event.node.setDataValue('validPropId', $event.value);
      this.submitData.push(something);
    }
    // console.log(this.rowData)
    // console.log(this.submitData)
    // console.log($event)
  }

  clearData() {
    this.form.get('receiptMethod').setValue('');
    this.form.get('agentName').setValue('');
    this.form.get('agentNumber').setValue('');
    this.form.get('receiptNumber').setValue('');
    this.form.get('periodDate').setValue('');
    this.form.get('propId').setValue('');
    this.form.get('bankAccount').setValue('');
    this.form.get('insuredName').setValue('');
    this.form.get('receiptAmount').setValue('');

    this.isShowEdit = false;
    this.isShowSubmit = false;
  }

  next() {
    this.isShowEdit = false;
    this.isShowSubmit = true;
  }

  back() {
    this.isShowEdit = true;
    this.isShowSubmit = false;
  }

  submit() {
    // console.log(this.submitData)
    if (this.submitData.length !== 0) {
      const toastRef = this.toastrService.show('waiting', 'Loading', {
        status: 'warning',
      });
      this.service.getUpdate(this.submitData).subscribe((responce: any) => {
        this.toastrService.show('waiting', 'Loading', {
          status: 'success',
          duration: 5000,
        });
        if (responce['status'] === 'OK') {
          this.isShowEdit = true;
          this.isShowSubmit = false;
        }
        toastRef.close();
        this.submitData = [];
        this.clearData();
      });
    } else {
      alert('undefined data editor');
    }
  }

  onClearAgentName() {
    this.form.get('agentName').setValue('');
  }

  onClearAgentNumber() {
    this.form.get('agentNumber').setValue('');
  }

  onClearReceiptNumber() {
    this.form.get('receiptNumber').setValue('');
  }

  onClearPropId() {
    this.form.get('propId').setValue('');
  }

  onClearBankAccount() {
    this.form.get('bankAccount').setValue('');
  }
}
