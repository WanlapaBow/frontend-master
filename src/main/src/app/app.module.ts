/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AgGridModule } from 'ag-grid-angular';
import { environment } from '../environments/environment';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { statementReducer } from './root-store/statement.reducer';
import { persistStateReducer } from './root-store/storage.metareducer';
const rootReducer = {
  statement: statementReducer,
};
// export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
//   const localStorageKey = '__arstatement';
//   return function(state, action) {
//     // console.log('state', state);
//     const result = reducer(state, action);
//     console.log(reducer(state, action));
//     localStorage.setItem(localStorageKey, JSON.stringify(result));
//     return result;
//   };
// }

export const metaReducers: MetaReducer<any>[] = [persistStateReducer];
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    CoreModule.forRoot(),
    AgGridModule.withComponents([]),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreModule.forRoot(rootReducer, { metaReducers }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      // logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
