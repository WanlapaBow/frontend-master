import * as moment from 'moment';

const columnDefsEdit = [
  {
    headerName: 'Valid Prop Id',
    field: 'validPropId',
    editable: true,
    cellRenderer: function (params) {
      return (
        '<span><i class="fa fa-edit text-primary"></i> ' +
        params.value +
        '</span>'
      );
    },
  },
  {
    headerName: 'Current Prop ID',
    field: 'currentPropId',
  },
  {
    headerName: 'Exception Reason',
    field: 'exceptionReason',
  },
  {
    headerName: 'Receipt Method',
    field: 'receiptMethod',
  },
  {
    headerName: 'Receipt Number',
    field: 'receiptNumber',
  },
  {
    headerName: 'Receipt Date',
    field: 'receiptDate',
    valueFormatter: function (value) {
      return value.value === null
        ? '-'
        : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    headerName: 'Receipt Amount',
    field: 'receiptAmount',
  },
  {
    headerName: 'Applied Amount',
    field: 'appliedAmount',
  },
  {
    headerName: 'Unapplied Amount',
    field: 'unappliedReceiptAmount',
  },
  {
    headerName: 'Agent Name',
    field: 'agentName',
  },
  {
    headerName: 'Agent Number',
    field: 'agentNumber',
  },
  {
    headerName: 'Insured Name',
    field: 'insuredName',
  },
  {
    headerName: 'Payment Time',
    field: 'paymentTime',
  },
  {
    headerName: 'Bank Name',
    field: 'bankName',
  },
  {
    headerName: 'Branch Name',
    field: 'branchName',
  },
  {
    headerName: 'Bank Account Name',
    field: 'bankAccountName',
  },
];
const columnDefsSubmit = [
  {
    headerName: 'Valid Prop Id',
    field: 'validPropId',
  },
  {
    headerName: 'Current Prop ID',
    field: 'currentPropId',
  },
  {
    headerName: 'Exception Reason',
    field: 'exceptionReason',
  },
  {
    headerName: 'Receipt Method',
    field: 'receiptMethod',
  },
  {
    headerName: 'Receipt Number',
    field: 'receiptNumber',
  },
  {
    headerName: 'Receipt Date',
    field: 'receiptDate',
    valueFormatter: function (value) {
      return value.value === null
        ? '-'
        : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    headerName: 'Receipt Amount',
    field: 'receiptAmount',
  },
  {
    headerName: 'Applied Amount',
    field: 'appliedAmount',
  },
  {
    headerName: 'Unapplied Amount',
    field: 'unappliedReceiptAmount',
  },
  {
    headerName: 'Agent Name',
    field: 'agentName',
  },
  {
    headerName: 'Agent Number',
    field: 'agentNumber',
  },
  {
    headerName: 'Insured Name',
    field: 'insuredName',
  },
  {
    headerName: 'Payment Time',
    field: 'paymentTime',
  },
  {
    headerName: 'Bank Name',
    field: 'bankName',
  },
  {
    headerName: 'Branch Name',
    field: 'branchName',
  },
  {
    headerName: 'Bank Account Name',
    field: 'bankAccountName',
  },
];
const defaultColDef = {
  resizable: true,
  filter: true,
};

const rowSelection = 'multiple';
const paginationPageSize = 10;
export {
  columnDefsEdit,
  columnDefsSubmit,
  defaultColDef,
  rowSelection,
  paginationPageSize,
};
