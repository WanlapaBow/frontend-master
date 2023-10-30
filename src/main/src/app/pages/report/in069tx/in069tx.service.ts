import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class In069txService {
  private getReportXlsxUrl: string = environment.apiUrl + 'api/v1/report/in069';

  constructor() {}

  getDownloadCsv(buid: any): void {
    window.open(this.getReportXlsxUrl + '?buId=' + buid, '_blank');
  }
}
