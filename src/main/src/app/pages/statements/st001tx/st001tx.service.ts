import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class St001txService {
  private postStatementCreateUrl: string =
    environment.apiUrl + 'api/v1/schedule/statement/create';
  private getLogFileUrl: string =
    environment.apiUrl + 'api/v1/schedule/statement/download';
  private getLogEmailUrl: string =
    environment.apiUrl + 'api/v1/schedule/statement/download/logemail';
  private getLogGLUrl: string = environment.apiUrl + 'api/v1/schedule/logs';

  constructor(private http: HttpClient) {}

  postStatementCreate(body: any): Observable<object> {
    return this.http.post(this.postStatementCreateUrl, body).pipe(take(1));
  }
  getPdf(requestId: any): Observable<any> {
    const params = new HttpParams().set('requestId', requestId);
    return this.http
      .get(this.getLogFileUrl, {
        responseType: 'blob',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => this._preDownload(data)),
        take(1),
      );
  }
  getLogEmail(requestId: any): Observable<any> {
    const params = new HttpParams().set('requestId', requestId);
    return this.http
      .get(this.getLogEmailUrl, {
        responseType: 'blob',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => this._preDownload(data)),
        take(1),
      );
  }

  getLog(index: any, limit: any): Observable<object> {
    const params = new HttpParams()
      .set('jobName', 'XCUST_AR_STATEMENT_REP')
      .set('offset', index)
      .set('limit', limit);
    return this.http.get(this.getLogGLUrl, { params }).pipe(take(1));
  }
  private _preDownload(data): any {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const contentDispositionHeader = data.headers.get('Content-Disposition');
    // console.log('contentDispositionHeader->', contentDispositionHeader);
    if (contentDispositionHeader !== null) {
      const contentDispositionHeaderResult = contentDispositionHeader
        .split(';')[1]
        .trim()
        .split('=')[1];
      const contentDispositionFileName = contentDispositionHeaderResult.replace(
        /"/g,
        '',
      );
      // console.log('contentDispositionHeaderResult->', contentDispositionHeaderResult);
      // console.log('contentDispositionFileName->', contentDispositionFileName);
      if (contentDispositionFileName && contentDispositionHeaderResult) {
        return { blob, filename: contentDispositionFileName };
      } else {
        return { blob, filename: null };
      }
    }
  }
}
