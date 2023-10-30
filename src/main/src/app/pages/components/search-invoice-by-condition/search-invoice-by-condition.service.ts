import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SearchInvoiceByConditionService {
  private getHeaderUrl: string = environment.apiUrl + 'api/v1/statement/';
  private getInvoiceDetailUrl: string = environment.apiUrl + 'api/v1/receipts/create/';
  constructor(private http: HttpClient) {}
  getSearchStatement(value: any, limit: any, offset: any): Observable<object> {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('status', 'CONFIRMED')
      .set('statementNumber', value.statementNumber)
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get(this.getHeaderUrl, { params });
  }
  getInvoiceDetailById(
    statementId: any,
    limit: any,
    offset: any,
  ): Observable<object> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get(this.getInvoiceDetailUrl + statementId + '/invoice', { params })
      .pipe(take(1));
  }
}
