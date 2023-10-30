import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rc001txService {
  private getHeaderByIdUrl: string = environment.apiUrl + 'api/v1/statement';
  private getRecieptDetailUrl: string = environment.apiUrl + 'api/v1/receipts/';
  // private getInvoiceDetailUrl: string = environment.apiUrl + 'api/v1/receipts/';
  private getInvoiceDetailUrl: string =
    environment.apiUrl + 'api/v1/receipts/create/';
  private postReceiptCreateUrl: string =
    environment.apiUrl + 'api/v1/receipts/create';
  private getPeriodAccountingUrl: string =
    environment.apiUrl + 'api/v1/receipts/getPeriodAccounting';
  private postCompleteUrl: string =
    environment.apiUrl + 'api/v1/statement/completed';
  private getButtonUrl: string =
    environment.apiUrl + 'api/v1/statement/button/advanceReceipt';
  private getCheckPeriodAccountUrl: string =
    environment.apiUrl + 'api/v1/receipts/checkPeriod';
  constructor(private http: HttpClient) {}

  getHeaderById(value: any): Observable<object> {
    return this.http.get(this.getHeaderByIdUrl + '/' + value, {}).pipe(take(1));
  }
  getRecieptDetailById(statementId: any): Observable<object> {
    return this.http
      .get(this.getRecieptDetailUrl + statementId + '/receipts', {})
      .pipe(take(1));
  }
  getInvoiceDetailById(statementId: any): Observable<object> {
    // const params = new HttpParams()
    //   .set('offset', index)
    //   .set('limit', limit);
    return this.http
      .get(this.getInvoiceDetailUrl + statementId + '/invoice', {})
      .pipe(take(1));
  }
  postReceiptCreate(body: any): Observable<object> {
    return this.http.post(this.postReceiptCreateUrl, body).pipe(take(1));
  }
  getPeriodByStatementNumber(statementNumber: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', statementNumber);
    return this.http.get(this.getPeriodAccountingUrl, { params }).pipe(take(1));
  }
  getCheckPeriod(value: any): Observable<object> {
    const params = new HttpParams().set('accountingDate', value);
    return this.http
      .get(this.getCheckPeriodAccountUrl, { params })
      .pipe(take(1));
  }

  postCompleteStd(stdNumber: any): Observable<object> {
    const param = {
      statementNumber: stdNumber,
    };
    return this.http.post(this.postCompleteUrl, param).pipe(take(1));
  }
  getButton(statementNumber: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', statementNumber);
    return this.http.get(this.getButtonUrl, { params });
  }
}
