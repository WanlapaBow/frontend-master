
const settingEmail = [
  {
    headerName: 'EMAIL',
    field: 'email',
    width: 500,
  },
  {
    headerName: 'EMAIL GROUP',
    field: 'emailGroup',
    width: 500,
  },
];
const defaultColDef = {
  resizable: true,
  filter: true,
  sortable: true,
};

const rowSelection = 'multiple';
const paginationPageSize = 10;

export { defaultColDef, settingEmail, rowSelection, paginationPageSize };
