import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbAccordionModule,
  NbAutocompleteModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTooltipModule,
  NbUserModule,
} from '@nebular/theme';
import { AgGridModule } from 'ag-grid-angular';
import { ThemeModule } from '../../@theme/theme.module';
import { PagesModule } from '../pages.module';
import { EmailConfigCheckboxComponent } from './email-config/email-config-checkbox/email-config-checkbox.component';
import { EmailConfigComponent } from './email-config/email-config.component';
import { ConfirmDeleteComponent } from './email-setup/confirm-delete/confirm-delete.component';
import { ConfirmEditComponent } from './email-setup/confirm-edit/confirm-edit.component';
import { EmailSetupComponent } from './email-setup/email-setup.component';
import { In079txComponent } from './in079tx/in079tx.component';
import { Rc001txComponent } from './rc001tx/rc001tx.component';
import { DeleteBtnAggridComponent } from './rc002tx/delete-btn-aggrid/delete-btn-aggrid.component';
import { Rc002txComponent } from './rc002tx/rc002tx.component';
import { Rc003txComponent } from './rc003tx/rc003tx.component';
import { Rc004txComponent } from './rc004tx/rc004tx.component';
import { Rc005txComponent } from './rc005tx/rc005tx.component';
import { Rc006txComponent } from './rc006tx/rc006tx.component';
import { Rc007txComponent } from './rc007tx/rc007tx.component';
import { St001txButtonComponent } from './st001tx/st001tx-button/st001tx-button.component';
import { St001txSelectEmailSenderComponent } from './st001tx/st001tx-select-email-sender/st001tx-select-email-sender.component';
import { St001txStatusComponent } from './st001tx/st001tx-status/st001tx-status.component';
import { St001txComponent } from './st001tx/st001tx.component';
import { ConfirmButtonComponent } from './st002tx/confirm-button/confirm-button.component';
import { DownloadLogBtnComponent } from './st002tx/download-log-btn/download-log-btn.component';
import { St002txCheckboxWhtComponent } from './st002tx/st002tx-checkbox-wht/st002tx-checkbox-wht.component';
import { St002txCheckboxComponent } from './st002tx/st002tx-checkbox/st002tx-checkbox.component';
import { St002txSelectAllComponent } from './st002tx/st002tx-select-all/st002tx-select-all.component';
import { St002txSelectEmailSenderComponent } from './st002tx/st002tx-select-email-sender/st002tx-select-email-sender.component';
import { St002txComponent } from './st002tx/st002tx.component';
import { UploadDialogComponent } from './st002tx/upload-dialog/upload-dialog.component';
import { St003txStatementCheckBoxComponent } from './st003tx/st003tx-statement-check-box/st003tx-statement-check-box.component';
import { St003txComponent } from './st003tx/st003tx.component';
import { StatementsRoutingModule } from './statements-routing.module';
import { StatementsComponent } from './statements.component';

@NgModule({
  declarations: [
    StatementsComponent,
    St001txComponent,
    St002txComponent,
    Rc001txComponent,
    St003txComponent,
    Rc002txComponent,
    UploadDialogComponent,
    St002txCheckboxComponent,
    St002txSelectAllComponent,
    St002txCheckboxWhtComponent,
    DownloadLogBtnComponent,
    St003txStatementCheckBoxComponent,
    Rc003txComponent,
    DeleteBtnAggridComponent,
    Rc004txComponent,
    Rc005txComponent,
    Rc006txComponent,
    Rc007txComponent,
    St001txButtonComponent,
    St001txStatusComponent,
    EmailConfigComponent,
    EmailConfigCheckboxComponent,
    St001txSelectEmailSenderComponent,
    St002txSelectEmailSenderComponent,
    In079txComponent,
    EmailSetupComponent,
    ConfirmDeleteComponent,
    ConfirmEditComponent,
    ConfirmButtonComponent,
  ],
  imports: [
    CommonModule,
    StatementsRoutingModule,
    CommonModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbSelectModule,
    NbDatepickerModule,
    NbIconModule,
    ReactiveFormsModule,
    AgGridModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbListModule,
    NbUserModule,
    NbFormFieldModule,
    NbAutocompleteModule,
    NbAccordionModule,
    NbContextMenuModule,
    NbTooltipModule,
    PagesModule,
  ],
  providers: [DecimalPipe],
})
export class StatementsModule { }
