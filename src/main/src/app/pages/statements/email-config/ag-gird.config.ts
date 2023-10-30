import { EmailConfigCheckboxComponent } from '../email-config/email-config-checkbox/email-config-checkbox.component';

const settingEmail = [
  {
    headerName: '',
    field: 'isEnable',
    cellRendererFramework: EmailConfigCheckboxComponent,
    // headerComponentFramework: St002txSelectAllComponent,
    width: 50,
  },
  {
    headerName: 'EMAIL',
    field: 'email',
    width: 500,
  },
  {
    headerName: 'HOST NAME',
    field: 'hostName',
    width: 500,
  },
];
const defaultCofDef = {
  resizable: true,
  filter: true,
  sortable: true,
};

export { defaultCofDef, settingEmail };
