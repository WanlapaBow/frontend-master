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
  NbUserModule,
} from '@nebular/theme';
import { AgGridModule } from 'ag-grid-angular';
import { ThemeModule } from '../../@theme/theme.module';
import { PagesModule } from '../pages.module';
import { InterfaceAllComponent } from './interface-all/interface-all.component';
import { InterfaceButtonDownloadComponent } from './interface-all/interface-button-download/interface-button-download.component';
import { InterfaceRoutingModule } from './interface-routing.module';
import { InterfaceComponent } from './interface.component';

@NgModule({
  declarations: [
    InterfaceComponent,
    InterfaceAllComponent,
    InterfaceButtonDownloadComponent,
  ],
  imports: [
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
    PagesModule,
    InterfaceRoutingModule,
  ],
  providers: [DecimalPipe],
})
export class InterfaceModule {}
