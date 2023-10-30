import * as moment from 'moment';

const logSetting = [
  {
    headerName: 'Log',
    field: 'requestId',
    colId: 'params',
    width: 80,
    // cellRendererFramework: St001txButtonComponent,
    // cellRendererParams: {
    //   onClick: (params) => this.onDeteleBtn(params),
    //   label: 'Click 1',
    // },
  },
  {
    headerName: 'userJobName',
    field: 'userJobName',
  },
  {
    headerName: 'jobInfoId',
    field: 'jobInfoId',
  },
  {
    headerName: 'requestId',
    field: 'requestId',
    valueFormatter: function (value) {
      return value.value === null ? '-' : value.value;
    },
  },
  {
    headerName: 'jobInfoStatus',
    field: 'jobInfoStatus',
    cellRenderer: function (params) {
      const success =
        '<div class"text-success">' +
        '<svg width="1.4em" height="1.4em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
        '  <path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/>\n' +
        '</svg> Success </div>';
      const running =
        '<div class="spinner-border text-primary spinner-border-sm" role="status">\n' +
        '            <span class="sr-only"></span>\n' +
        '          </div> Runing...';
      const error =
        '<svg width="1.4em" height="1.4em" viewBox="0 0 16 16" class="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">\n' +
        '  <path fill-rule="evenodd" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>\n' +
        '</svg> Error';
      if (
        params.value === 'Importing' ||
        params.value === 'Running' ||
        params.value === 'Imported'
      ) {
        return running;
      } else if (params.value === 'Completed') {
        return success;
      } else if (params.value === 'Failed') {
        return error;
      }
    },
  },
  // {
  //   headerName: 'reportParameters',
  //   field: 'reportParameters',
  // },
  {
    headerName: 'parentJobId',
    field: 'parentJobId',
  },
  {
    headerName: 'owner',
    field: 'owner',
  },
  {
    headerName: 'successMatchReceipts',
    field: 'successMatchReceipts',
  },
  {
    headerName: 'startProcessing',
    field: 'startProcessing',
    valueFormatter: function (value) {
      return moment(value.value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    headerName: 'start Import Data Processing',
    field: 'startImportDataProcessing',
    valueFormatter: function (value) {
      return value.value === null
        ? '-'
        : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  // {
  //   headerName: 'startCreateStatementProcessing',
  //   field: 'startCreateStatementProcessing',
  //   valueFormatter: function (value) {
  //     return value.value === null
  //       ? '-'
  //       : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
  //   },
  // },
  {
    headerName: 'endProcessing',
    field: 'endProcessing',
    valueFormatter: function (value) {
      return value.value === null
        ? '-'
        : moment(value.value).format('DD/MM/YYYY HH:mm:ss');
    },
  },
  {
    headerName: 'pbusinessUnit',
    field: 'pbusinessUnit',
  },
  {
    headerName: 'pcustomerClass',
    field: 'pcustomerClass',
  },
  {
    headerName: 'psiteNumber',
    field: 'psiteNumber',
  },
  {
    headerName: 'pcustomerCode',
    field: 'pcustomerCode',
  },
  {
    headerName: 'pperiodCode',
    field: 'pperiodCode',
  },
  {
    headerName: 'psendEmail',
    field: 'psendEmail',
  },
];
const defaultCofDef = {
  resizable: true,
  filter: true,
  sortable: true,
};
export { defaultCofDef, logSetting };
