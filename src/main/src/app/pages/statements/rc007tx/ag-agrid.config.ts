import { DecimalPipe } from '@angular/common';
import { UtilsService } from '../../../_helpers/utils.service';

const setting = [
  {
    headerName: 'BUSINESS UNIT',
    field: 'businessUnitName',
  },
  {
    headerName: 'STATEMENT ID',
    field: 'statementId',
  },
  {
    headerName: 'STATEMENT NUMBER',
    field: 'statementNumber',
  },
  {
    headerName: 'STATEMENT DATE',
    field: 'statementDate',
    valueFormatter: function (params) {
      return params.value !== null
        ? new UtilsService().dateFormatUtc(params.value)
        : '-';
    },
  },
  {
    headerName: 'CUSTOMER',
    children: [
      {
        headerName: 'CUSTOMER NUMBER',
        field: 'customerNumber',
      },
      {
        headerName: 'CUSTOMER NAME',
        field: 'customerName',
        columnGroupShow: 'open',
      },
    ],
  },
  {
    headerName: 'SITE NUMBER',
    field: 'siteNumber',
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
    field: 'outputVatAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'WHT 1%',
    field: 'premiumWhtPercentAmount',
    valueFormatter: function (params) {
      return new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'COMMISSION',
    field: 'commissionAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'INPUT VAT AMOUNT',
    field: 'commissionInputVatAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'WHT COMMISSION',
    field: 'commissionWhtAmount',
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
    headerName: 'OVERDUE AMOUNT',
    field: 'overdueAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'DUE AMOUNT',
    field: 'dueAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'NOT DUE AMOUNT',
    field: 'notDueAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'STATEMENT AMOUNT',
    field: 'statementAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'PAID AMOUNT',
    field: 'paidAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'REMAINING AMOUNT',
    field: 'remainingAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'STATUS',
    field: 'statementStatus',
  },
  {
    headerName: 'EMAIL',
    field: 'email',
  },
];
const settingReceipt = [
  {
    headerName: 'CERTIFICATE STATUS',
    field: 'advanceWhtCertificateStatus',
  },
  {
    headerName: 'CERTIFICATE NUMBER',
    field: 'certificateNumber',
  },
  {
    headerName: 'INVOICE NUMBER',
    field: 'invoiceNumber',
  },
  {
    headerName: 'PERSON RESPONSIBLE NAME',
    field: 'personResponsibleName',
  },
  {
    headerName: 'PERSON RESPONSIBLE ADDRESS',
    field: 'personResponsibleAddress',
  },
  {
    headerName: 'PERSON RESPONSIBLE WHT TAX ID NUMBER',
    field: 'personResponsibleTaxIdNumber',
  },
  {
    headerName: 'PERSON WHT NAME',
    field: 'personBeingWhtName',
  },
  {
    headerName: 'PERSON WHT ADDRESS',
    field: 'personBeingWhtAddress',
  },
  {
    headerName: 'PERSON BEING WHT TAX ID NUMBER',
    field: 'personBeingWhtTaxIdNumber',
  },
  {
    headerName: 'PND TYPE',
    field: 'pndType',
  },
  {
    headerName: 'REVENUE TYPE',
    field: 'revenueType',
  },
  {
    headerName: 'REVENUE NAME',
    field: 'revenueName',
  },
  {
    headerName: 'WHT DATE',
    field: 'whtDate',
  },
  {
    headerName: 'PAID AMT',
    field: 'paidAmt',
  },
  {
    headerName: 'TAX WHT AMT',
    field: 'taxWhtAmt',
  },
  {
    headerName: 'TOTAL PAID',
    field: 'totalPaid',
  },
  {
    headerName: 'TOTAL TAX WHT',
    field: 'totalTaxWht',
  },
  {
    headerName: 'WHT CONDITION',
    field: 'whtCondition',
  },
  {
    headerName: 'WHT CERTIFICATE DATE',
    field: 'whtCertificateDate',
  },
  {
    headerName: 'CANCEL DATE',
    field: 'cancelDate',
    valueFormatter: function (params) {
      return params.value !== null
        ? new UtilsService().dateFormatUtc(params.value)
        : '-';
    },
  },
  {
    headerName: 'User',
    field: 'user',
    valueFormatter: function (params) {
      return params.value != null ? params.value : '-';
    },
  },
  {
    headerName: 'CANCEL REASON',
    field: 'cancelReason',
  },
  {
    headerName: 'CANCEL BY',
    field: 'cancelBy',
  },
];
const defaultCol = {
  resizable: true,
  filter: true,
  sortable: true,
};
export { setting, settingReceipt, defaultCol };
