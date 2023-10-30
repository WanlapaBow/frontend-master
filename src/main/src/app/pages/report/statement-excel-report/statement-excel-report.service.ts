import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {take} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatementExcelReportService {
  private getReportXlsxUrl: string = environment.apiUrl + 'api/v1/report/statementReportExcel';
  private getLogGLUrl: string = environment.apiUrl + 'api/v1/report/logs';
  private getDownloadUrl: string = environment.apiUrl + 'api/v1/report/download';

  constructor(private http: HttpClient) {
  }

  getDownloadCsv(params: any): void {
    window.open(this.getReportXlsxUrl + '?' + params, '_blank');
  }
  getDownloadXlsx(params: any): void {
    window.open(this.getDownloadUrl + '?' + params, '_blank');
  }
  getGenerate(formValue: any): Observable<any> {
    return this.http.post(this.getReportXlsxUrl, formValue).pipe(take(1));

  }
  // getDownloadCsv(params: any): Observable<any> {
  //   return this.http.get(this.getReportXlsxUrl, {
  //     params,
  //     responseType: 'blob' as 'json',
  //     observe: 'response',
  //   })
  //     .pipe(
  //       map((data) => data),
  //       take(1),
  //     );
  // }
  getLog(index: any, limit: any): Observable<object> {
    const params = new HttpParams()
      .set('offset', index)
      .set('limit', limit)
      .set('reportName', 'StatementReportExcel');
    return this.http.get(this.getLogGLUrl, { params }).pipe(take(1));
  }

}
