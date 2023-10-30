import { DecimalPipe } from '@angular/common';
import { UtilsService } from '../../../_helpers/utils.service';
const statementSetting = [
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
    headerName: 'SUM WRITE OFF',
    field: 'sumWriteOff',
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
const invoiceSetting = [
  {
    headerName: 'PROP ID',
    field: 'propId',
  },
  {
    headerName: 'INVOICE NO.',
    field: 'invoiceNumber',
  },
  {
    headerName: 'CURRENT APPLIED AMOUNT',
    field: 'receiptAppliedAmount',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
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
    headerName: 'WRITE OFF',
    field: 'writeOff',
    valueFormatter: function (params) {
      return params.value != null
        ? new DecimalPipe('en-EN').transform(params.value, '1.2-2')
        : '0';
    },
  },
  {
    headerName: 'RECEIPT STATUS',
    field: 'receiptStatus',
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
    headerName: 'DEDUCT WHT STATUS',
    field: 'deductWhtStatus',
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
const defaultColDef = {
  resizable: true,
  filter: true,
  sortable: true,
};

export { statementSetting, invoiceSetting, defaultColDef };
