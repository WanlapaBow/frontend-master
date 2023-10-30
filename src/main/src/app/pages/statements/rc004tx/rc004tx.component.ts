import { DecimalPipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  NbDialogService,
  NbSidebarService,
  NbToastrService,
  NbToastRef,
} from '@nebular/theme';
import { CommonService } from '../../../_helpers/common.service';
import { UtilsService } from '../../../_helpers/utils.service';
import { SearchInvoiceByConditionComponent } from '../../components/search-invoice-by-condition/search-invoice-by-condition.component';
import { Rc004txService } from './rc004tx.service';

@Component({
  selector: 'ngx-rc004tx',
  templateUrl: './rc004tx.component.html',
  styleUrls: ['./rc004tx.component.scss'],
})
export class Rc004txComponent implements OnInit {
  form: FormGroup;
  // ag-grid
  columnInvoiceDefs: any;
  invDefaultColDef: any;
  invoiceData: any[] = [];
  paginationPageSize: number;
  gridApiInvoice: any;
  gridInvoiceColumnApi: any;
  rowSelection: any;
  invoiceSelectList: any[] = [];
  tempReceiptAmount: number = 0;
  tempUnapplieAmount: number = 0;
  tempApplieAmount: number = 0;
  tempMaxAppliedAmount: number = 0;
  currentUnApplieAmount: number = 0;
  tempRemaining: number = 0;
  isClear: boolean = false;
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
  param: any;
  loading: boolean = false;
  constructor(
    public commonService: CommonService,
    private toastrService: NbToastrService,
    private service: Rc004txService,
    private dialogService: NbDialogService,
    private _activatedroute: ActivatedRoute,
    private location: Location,
    private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.compact('menu-sidebar');
  }

  ngOnInit(): void {
    this._activatedroute.paramMap.subscribe((params) => {
      this.param = {
        businessUnit: params.get('buid'),
        customerClass: params.get('cusId'),
      };
    });
    this.form = new FormGroup({
      receiptMethodId: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      receiptNumber: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      receiptDate: new FormControl(
        { value: new Date(), disabled: false },
        Validators.required,
      ),
      accountingDate: new FormControl(
        { value: new Date(), disabled: false },
        Validators.required,
      ),
      maturityDate: new FormControl({ value: '', disabled: false }),
      depositDate: new FormControl(
        { value: new Date(), disabled: false },
        Validators.required,
      ),
      remark: new FormControl({ value: '', disabled: false }),
      receiptAmount: new FormControl(
        { value: 0, disabled: false },
        Validators.required,
      ),
      unappliedAmount: new FormControl({ value: 0, disabled: false }), // เฉพาะหน้าบ้าน
    });
    this.columnInvoiceDefs = [
      {
        headerName: '',
        field: 'isSelect',
        checkboxSelection: true,
        width: 50,
      },
      {
        headerName: 'PROP ID',
        field: 'propId',
        editable: false,
      },
      {
        headerName: 'edit amount to apply',
        field: 'isAppliedAmount',
        editable: true,
      },
      {
        headerName: 'APPLIED AMOUNT',
        field: 'appliedAmount',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'INVOICE NO.',
        field: 'invoiceNumber',
      },
      {
        headerName: 'ผู้เอาประกันภัย',
        field: 'beneficiaryName',
      },
      {
        headerName: 'จังหวัด',
        field: 'motorLicenseProvince',
      },
      {
        headerName: 'เลขทะเบียนรถ',
        field: 'motorLicensePlateNumber',
      },
      {
        headerName: 'POLICY NUMBER',
        field: 'policyNumber',
      },
      {
        headerName: 'PREMIUM',
        field: 'premium',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'STAMP',
        field: 'stamp',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'OUTPUT VAT',
        field: 'outputVat',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT 1%',
        field: 'wht1percent',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT1% CODE',
        field: 'whtCode',
      },
      {
        headerName: 'COMMISSION',
        field: 'commission',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'INPUT VAT',
        field: 'inputVat',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'WHT',
        field: 'whtCommission',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'SERVICE FEE',
        field: 'serviceFee',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'GROSS',
        field: 'totalGross',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'TOTAL NET',
        field: 'totalNet',
        valueFormatter: function (params) {
          return params.value != null
            ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
            : '0';
        },
      },
      {
        headerName: 'EFFECTIVE STARTDATE',
        field: 'effectiveStartDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'INVOICE DUE DATE',
        field: 'invoiceDueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'STATUS',
        field: 'invoiceDueStatus',
      },
      {
        headerName: 'PAYMENT STATUS',
        field: 'paymentStatus',
      },
      {
        headerName: 'NET OR GROSS',
        field: 'netOrGross',
      },
      {
        headerName: 'POLICY TYPE NAME',
        field: 'policyTypeName',
      },
      {
        headerName: '% COM',
        field: 'percentCommission',
      },
      {
        headerName: 'CONTRACT TYPE',
        field: 'contractType',
      },
      {
        headerName: 'ISSUE DATE',
        field: 'issueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'EXPIRY DATE',
        field: 'expiryDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'SENDER AGENT NUMBER',
        field: 'senderAgentNumber',
      },
      {
        headerName: 'SENDER AGENT NAME',
        field: 'senderAgentName',
      },
      {
        headerName: 'CHASSIS',
        field: 'motorChassis',
      },
      {
        headerName: 'ENGINE',
        field: 'motorEngine',
      },
      {
        headerName: 'ยี่ห้อรถ',
        field: 'motorCarBrandName',
      },
      {
        headerName: 'CAMPAIGN',
        field: 'campaign',
      },
      {
        headerName: 'TRANS NUMBER',
        field: 'pandaTransNumber',
      },
      {
        headerName: 'D-CHANNEL',
        field: 'dchannel',
      },
      {
        headerName: 'PAYMENT DUE DATE',
        field: 'paymentDueDate',
        valueFormatter: function (params) {
          return params.value !== null
            ? new UtilsService().dateFormatUtc(params.value)
            : '-';
        },
      },
      {
        headerName: 'ประเภทสัญญา',
        field: 'motorContractPolicyType',
      },
      {
        headerName: 'เลขที่สัญญา',
        field: 'motorContractPolicyNumber',
      },
      {
        headerName: 'CO SIGN',
        field: 'coSign',
      },
      {
        headerName: 'COLLATERAL NO.',
        field: 'collateralNo',
      },
      {
        headerName: 'CAR TYPE',
        field: 'motorCarType',
      },
      {
        headerName: 'ทุนประกัน',
        field: 'faceAmount',
      },
      {
        headerName: 'ประเภททุนประกัน',
        field: 'beneficiaryType',
      },
    ];
    this.invDefaultColDef = {
      resizable: true,
      filter: true,
      editable: true,
    };
    this.paginationPageSize = 10;
    this.rowSelection = 'multiple';
  }

  onPaginationChanged(event) {
    if (this.gridApiInvoice) {
    }
  }

  onGridReadyInvoice(params) {
    this.gridApiInvoice = params.api;
    this.gridInvoiceColumnApi = params.columnApi;
  }

  onCellEditClick($event: any, key, char, pinned) {
    this.gridApiInvoice.setFocusedCell(
      $event.rowIndex,
      'isAppliedAmount',
      pinned,
    );
    this.gridApiInvoice.startEditingCell({
      rowIndex: $event.rowIndex,
      colKey: 'isAppliedAmount',
    });
  }

  onCellEditStart($event: any) {
    const sumMaxAppliedAmt =
      this.calNetGross($event.data) - $event.data.appliedAmount;
    this.currentUnApplieAmount = Number(sumMaxAppliedAmt.toFixed(2));
    $event.data.maxApplied = sumMaxAppliedAmt;
  }

  onCellEditStop($event: any) {
    const sumByRow =
      this.calNetGross($event.data) -
      $event.data.appliedAmount -
      $event.data.isAppliedAmount;
    this.currentUnApplieAmount = Number(sumByRow.toFixed(2));
    this.calCulateUnApplieAmt();
    this.invoiceSelectList.map((value, index) => {
      if (value.invoiceId === $event.data.id) {
        value.appliedAmount = Number($event.data.isAppliedAmount);
      }
    });
  }

  onCellValueChange($event: any) {
    if ($event.data.isAppliedAmount > $event.data.maxApplied) {
      confirm(
        'applied amount เกินที่สามารถทำได้! กรุณาแก้ไข edit applied amount',
      );
      this.gridApiInvoice.getRowNode(0).setDataValue('isAppliedAmount', 0);
    }
  }

  onInvoiceValueChange(event: any) {
    if (!this.isClear) {
      if (event.data.isSelect === undefined || event.data.isSelect === false) {
        event.data.isSelect = true;
        const invoiceSelect = {
          invoiceId: event.data.id,
          appliedAmount: Number(event.data.isAppliedAmount),
        };
        this.invoiceSelectList.push(invoiceSelect);
        this.calCulateUnApplieAmt();
        this.currentUnApplieAmount =
          this.calNetGross(event.data) -
          event.data.appliedAmount -
          event.data.isAppliedAmount;
      } else {
        event.data.isSelect = false;
        this.calCulateUnApplieAmt();
        // const indexRemove = this.invoiceSelectList.indexOf(event.data.id);
        const indexRemove = this.invoiceSelectList.findIndex(
          (x) => x.invoiceId === event.data.id,
        );
        this.invoiceSelectList.splice(indexRemove, 1);
        this.currentUnApplieAmount = event.data.maxApplied;
      }
    }
  }

  clearData() {
    this.isClear = true;
    if (this.isClear) {
      this.tempUnapplieAmount = 0;
      this.tempReceiptAmount = 0;
      this.invoiceSelectList = [];
      this.form.get('receiptMethodId').setValue('');
      this.form.get('receiptNumber').setValue('');
      this.form.get('receiptAmount').setValue(0);
      this.form.get('unappliedAmount').setValue(0);
      this.form.get('receiptDate').setValue(new Date());
      this.form.get('accountingDate').setValue(new Date());
      this.form.get('maturityDate').setValue('');
      this.form.get('depositDate').setValue(new Date());
      this.form.get('remark').setValue('');
      this.tempReceiptAmount = 0;
      this.tempUnapplieAmount = 0;
      this.tempApplieAmount = 0;
      this.tempMaxAppliedAmount = 0;
      this.currentUnApplieAmount = 0;
      this.invoiceData = [];
      // const tempLine = this.invoiceData.map((res) => {
      //   if (res.isSelect) {
      //     res.isSelect = false;
      //   }
      //   return res;
      // });
      // this.gridApiInvoice.applyTransaction({update: tempLine});
      this.gridApiInvoice.deselectAll();
      setTimeout(() => {
        this.isClear = false;
      }, 0);
    }
  }

  onReceiptCreate() {
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
    const params = this.form.value;
    params.invoices = this.invoiceSelectList;
    // params.statementNumber = this.statementHeader.statementNumber;
    // const isCheckSigns = this.checkSignUnApplieValue(this.form.value.unappliedAmount);
    // if (isCheckSigns === 1 || isCheckSigns === 0) {
    if (this.invoiceSelectList.length === 0) {
      setTimeout(() => {
        alert('กรุณาเลือก Invoice อย่างน้อย 1 ใบ');
        this.loading = false;
        toastRef.close();
      }, 1000);
    } else {
      this.service.postReceiptCreate(params).subscribe(
        (response) => {
          if (response['status'] === 'OK') {
            this.loading = false;
            toastRef.close();
            this.toastrService.show(
              this.toastrMsg.saveSuccess.message,
              this.toastrMsg.saveSuccess.title,
              {
                status: 'success',
                duration: 5000,
                destroyByClick: true,
              },
            );
            this.clearData();
          } else {
            this.loading = false;
            toastRef.close();
            this.toastrService.show(
              this.toastrMsg.noData.title,
              this.toastrMsg.noData.title,
              {
                status: 'danger',
                duration: 5000,
                destroyByClick: true,
              },
            );
          }
        },
        (error) => {
          this.loading = false;
          toastRef.close();
          this.toastrService.show(error.message, this.toastrMsg.error.title, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          });
        },
      );
    }
    // }
  }

  isReceiptAmountChange() {
    this.calCulateUnApplieAmt();
  }

  openSearchInvoice() {
    this.dialogService
      .open(SearchInvoiceByConditionComponent, {
        context: {
          businessUnit: this.param.businessUnit,
          customerClass: this.param.customerClass,
        },
      })
      .onClose.subscribe((data) => {
        if (data) {
          let listClearDuplicate = [];
          data.forEach((item) => {
            if (this.invoiceData.length > 0) {
              const check = this.invoiceData.filter((x) => x.id !== item.id);
              listClearDuplicate = check;
            } else {
              listClearDuplicate = data;
            }
          });
          if (listClearDuplicate.length > 0) {
            this.gridApiInvoice.applyTransaction({ add: listClearDuplicate });
          }
          const addRow = [];
          this.gridApiInvoice.forEachNode(function (node, index) {
            node.data.isSelect = false;
            addRow.push(node.data);
          });
          this.invoiceData = addRow;
        }
      });
  }

  onBack() {
    this.location.back();
  }

  calNetGross(rowdata) {
    if (rowdata.netOrGross === 'Net') {
      return rowdata.totalNet;
    } else if (rowdata.netOrGross === 'Gross') {
      return rowdata.totalGross;
    }
  }

  calCulateUnApplieAmt() {
    this.tempReceiptAmount = 0;
    this.tempUnapplieAmount = 0;
    let summaryUnapplied: number = 0;
    if (this.invoiceData.length > 0) {
      summaryUnapplied = this.invoiceData
        .filter((x) => x.isSelect === true)
        .reduce((a, b, index) => {
          return a + Number(b['isAppliedAmount'] || 0);
        }, 0);
    }
    this.tempReceiptAmount = Number(this.form.get('receiptAmount').value);
    this.tempUnapplieAmount = this.tempReceiptAmount - summaryUnapplied;
    this.tempApplieAmount = summaryUnapplied;
    this.tempMaxAppliedAmount = this.invoiceData
      .filter((x) => x.isSelect === true)
      .reduce((a, b, index) => {
        return a + b['maxApplied'];
      }, 0);
    this.tempRemaining = this.invoiceData
      .filter((x) => x.isSelect === true)
      .reduce((a, b, index) => {
        return Number(a + (b['maxApplied'] - b['isAppliedAmount']));
      }, 0);
    this.form
      .get('unappliedAmount')
      .setValue(this.tempUnapplieAmount.toFixed(2));
  }
}
