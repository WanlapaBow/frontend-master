import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class St003txService {
  private getHeaderUrl: string = environment.apiUrl + 'api/v1/statement/';
  private getLineUrl: string = environment.apiUrl + 'api/v1/statement/detail';

  constructor(private http: HttpClient) {}

  getSearchStatement(value: any, limit: any, offset: any): Observable<object> {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('status', value.status)
      .set('statementNumber', value.statementNumber)
      .set('customerCode', value.customerCode)
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get(this.getHeaderUrl, { params }).pipe(take(1));
  }

  getLine(value: any, limit: any, offset: any): Observable<object> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get(this.getLineUrl + '/' + value.statementId, { params })
      .pipe(take(1));
  }
}
