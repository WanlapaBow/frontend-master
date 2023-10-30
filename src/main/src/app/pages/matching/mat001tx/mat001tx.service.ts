import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Mat001txService {
  private postMatchingUrl: string = environment.apiUrl + 'api/v1/schedule/receipt/matching';
  private getLogGLUrl: string = environment.apiUrl + 'api/v1/schedule/logs';

  constructor(private http: HttpClient) {}

  postMatching(body: any) {
    return this.http.post(this.postMatchingUrl, body).pipe(take(1)).toPromise();
  }
  getLog(index: any, limit: any): Observable<object> {
    const params = new HttpParams()
      .set('jobName', 'XCUST_AR_AUTOMATE_MATCH_RECEIPT_STATEMENT_REP')
      .set('offset', index)
      .set('limit', limit);
    return this.http.get(this.getLogGLUrl, { params }).pipe(take(1));
  }
}
