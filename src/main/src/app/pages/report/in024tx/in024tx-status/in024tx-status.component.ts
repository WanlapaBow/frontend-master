import { Component } from '@angular/core';
import {ICellRendererAngularComp} from 'ag-grid-angular/public-api';

@Component({
  selector: 'ngx-in024tx-status',
  templateUrl: './in024tx-status.component.html',
  styleUrls: ['./in024tx-status.component.scss'],
})
export class In024txStatusComponent implements ICellRendererAngularComp {
  public params: any;
  statusList: any = {
    success: {
      title: 'success',
      icon: 'checkmark-circle-2-outline',
      color: 'success',
      msg: 'Success',
    },
    fail: {
      title: 'fail',
      icon: 'close-circle-outline',
      color: 'danger',
      msg: 'Fail',
    },
    run: {
      title: 'run',
      icon: '',
      color: 'info',
      msg: 'Running',
    },
    pending: {
      title: 'pending',
      icon: 'pause-circle-outline',
      color: 'warning',
      msg: 'Pending',
    },
    cancel: {
      title: 'cancel',
      icon: 'slash-outline',
      color: 'basic',
      msg: 'Cancel',
    },
    nodata: {
      title: 'nodata',
      icon: 'slash-outline',
      color: 'basic',
      msg: 'No Data',
    },
  };
  stepSync: any;
  stepImport: any;
  stepReport: any;
  constructor() {}

  agInit(params: any): void {
    this.params = params;
    this.checkStep(this.params.data['jobInfoStatus']);
  }
  refresh(params?: any): boolean {
    this.checkStep(this.params.data['jobInfoStatus']);
    return true;
  }
  checkStep(value) {
    switch (value) {
      case 'Running': // stepSync
        this.stepSync = this.statusList.run;
        this.stepImport = this.statusList.pending;
        this.stepReport = this.statusList.pending;
        break;
      case 'Success': // stepSync
        this.stepSync = this.statusList.success;
        this.stepImport = this.statusList.pending;
        this.stepReport = this.statusList.pending;
        break;
      case 'Imported': // stepImport
      case 'Importing': // stepImport
        this.stepSync = this.statusList.success;
        this.stepImport = this.statusList.run;
        this.stepReport = this.statusList.pending;
        break;
      case 'Generate': // stepImport
      case 'ReportGenerate': // stepReport
        this.stepSync = this.statusList.success;
        this.stepImport = this.statusList.success;
        this.stepReport = this.statusList.pending;
        break;
      case 'Completed': // stepReport
        this.stepSync = this.statusList.success;
        this.stepImport = this.statusList.success;
        this.stepReport = this.statusList.success;
        break;
      case 'Failed': // Fail stepSync ,stepImport
        this.stepSync = this.statusList.fail;
        this.stepImport = this.statusList.fail;
        this.stepReport = this.statusList.fail;
        break;
      case 'ReportFailed': // Fail stepReport
        this.stepSync = this.statusList.success;
        this.stepImport = this.statusList.success;
        this.stepReport = this.statusList.nodata;
        break;
      case 'Canceled': // Fail stepReport
        this.stepSync = this.statusList.cancel;
        this.stepImport = this.statusList.cancel;
        this.stepReport = this.statusList.cancel;
        break;
      default:
      // code block
    }
  }
}
