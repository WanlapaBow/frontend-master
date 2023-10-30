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
    valueFormatter: function (value) {
      return new UtilsService().dateFormatddmmyyyy(value.value);
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
      return params.value != null
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
    headerName: 'ID',
    field: 'advanceReceiptId',
    width: 80,
  },
  {
    headerName: 'STATEMENT REFERENCE',
    children: [
      { headerName: 'PROP ID', field: 'propId' },
      { headerName: 'INVOICE', field: 'invoiceNumber' },
      { headerName: 'POLICY', field: 'policyNumber', columnGroupShow: 'open' },
      { headerName: 'PREMIUM', field: 'premium', columnGroupShow: 'open' },
      { headerName: 'STAMP', field: 'stamp', columnGroupShow: 'open' },
      { headerName: 'GROSS', field: 'totalGross', columnGroupShow: 'open' },
      {
        headerName: 'PAYMENT STATUS',
        field: 'paymentStatus',
        columnGroupShow: 'open',
      },
      {
        headerName: 'TRANS NUMBER',
        field: 'pandaTransNumber',
        columnGroupShow: 'open',
      },
    ],
  },
  {
    headerName: 'RECEIPT/TAX INVOICE NUMBER',
    field: 'advanceReceiptNumber',
  },
  {
    headerName: 'ADVANCE RECEIPT DATE',
    field: 'advanceReceiptDate',
    valueFormatter: function (value) {
      return new UtilsService().dateFormatddmmyyyy(value.value);
    },
  },
  {
    headerName: 'ADVANCE EXPIRE DATE',
    field: 'advanceReceiptExpiryDate',
    valueFormatter: function (value) {
      return new UtilsService().dateFormatddmmyyyy(value.value);
    },
  },
  {
    headerName: 'ADVANCE RECEIPT STATUS',
    field: 'advanceReceiptStatus',
    sortingOrder: ['asc', 'desc'],
  },
  {
    headerName: 'INSURED BRANCH',
    field: 'insuredBranch',
  },
  {
    headerName: 'PAYMENT CUSTOMER NAME',
    field: 'paymentCustomerName',
  },
  {
    headerName: 'PAYMENT CUSTOMER SITE',
    field: 'paymentCustomerSite',
  },
  {
    headerName: 'PAYMENT CUSTOMER NUMBER',
    field: 'paymentCustomerNumber',
  },
  {
    headerName: 'PAYMENT CUSTOMER ADDRESS',
    field: 'paymentCustomerAddress',
  },
  {
    headerName: 'INSURED TAX ID',
    field: 'insuredTaxId',
  },
  {
    headerName: 'INSURED ADDRESS',
    field: 'insuredAddress',
  },
  {
    headerName: 'INSURED EMAIL',
    field: 'insuredEmail',
  },
  {
    headerName: 'VATTRANSACTION TYPE CODE',
    field: 'vatTransactionTypeCode',
  },
  {
    headerName: 'CLIENT NUMBER',
    field: 'clientNumber',
  },
  {
    headerName: 'CCDATE TEXT',
    field: 'ccDateText',
  },
  {
    headerName: 'CONTRACT POLICY NUMBER',
    field: 'contractPolicyNumber',
  },
  {
    headerName: 'EXPIRY DATE',
    field: 'expiryDate',
    valueFormatter: function (value) {
      return new UtilsService().dateFormatddmmyyyy(value.value);
    },
  },
  {
    headerName: 'OUTPUT VAT',
    field: 'outputVat',
  },
  {
    headerName: 'ISSUE DATE',
    field: 'issueDate',
    valueFormatter: function (value) {
      return new UtilsService().dateFormatddmmyyyy(value.value);
    },
  },
  {
    headerName: 'SENDER AGENT NUMBER',
    field: 'senderAgentNumber',
  },
  {
    headerName: 'CONTRACT TYPE',
    field: 'contractType',
  },
  {
    headerName: 'CANCEL DATE',
    field: 'cancelDate',
    valueFormatter: function (value) {
      return new UtilsService().dateFormatddmmyyyy(value.value);
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
const defaultColDef = {
  resizable: true,
  filter: true,
  sortable: true,
};
export { setting, settingReceipt, defaultColDef };
