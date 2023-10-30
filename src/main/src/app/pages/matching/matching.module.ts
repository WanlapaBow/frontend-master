import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import {
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
import { Mat001txComponent } from './mat001tx/mat001tx.component';
import { MatchingRoutingModule } from './matching-routing.module';
import { MatchingComponent } from './matching.component';

@NgModule({
  declarations: [MatchingComponent, Mat001txComponent],
  imports: [
    CommonModule,
    MatchingRoutingModule,
    NbCardModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbFormFieldModule,
    NbIconModule,
    AgGridModule,
    NbCheckboxModule,
    NbSpinnerModule,
    NbAutocompleteModule,
    NbContextMenuModule,
    PagesModule,
    ThemeModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbDatepickerModule,
    NbUserModule,
    NbListModule,
  ],
  providers: [DecimalPipe],
})
export class MatchingModule {}
