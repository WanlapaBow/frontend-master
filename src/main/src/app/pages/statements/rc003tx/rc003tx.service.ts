import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rc003txService {
  private getStatementHeaderUrl: string =
    environment.apiUrl + 'api/v1/statement/';
  private getStatementDetailUrl: string =
    environment.apiUrl + 'api/v1/statement/';
  private getReceiptAdvanceUrl: string =
    environment.apiUrl + 'api/v1/receipts/advance';
  private postReceiptCreate: string =
    environment.apiUrl + 'api/v1/receipts/advance/create';
  private postReceiptCancel: string =
    environment.apiUrl + 'api/v1/receipts/advance/cancelled';
  private getPdfUrl: string =
    environment.apiUrl + 'api/v1/receipts/advance/print/';
  private getPdfForChequeUrl: string =
    environment.apiUrl + 'api/v1/receipts/advance/cheque/print/';
  private getButtonUrl: string =
    environment.apiUrl + 'api/v1/statement/button/advanceReceipt';

  constructor(private http: HttpClient) {}

  getSearchStatement(value: any): Observable<object> {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('status', value.status)
      .set('statementNumber', value.statementNumber)
      .set('customerCode', value.customerCode);
    return this.http.get(this.getStatementHeaderUrl, { params });
  }

  getReceiptAdv(value: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', value);
    return this.http.get(this.getReceiptAdvanceUrl, { params }).pipe(take(1));
  }

  postReceiptAdvCreate(body: any): Observable<object> {
    return this.http.post(this.postReceiptCreate, body).pipe(take(1));
  }

  postReceiptAdvCancel(body: any): Observable<object> {
    return this.http.post(this.postReceiptCancel, body).pipe(take(1));
  }
  getDownloadPdf(value: any): Observable<any> {
    return this.http
      .get(this.getPdfUrl + value, {
        responseType: 'blob' as 'json',
        observe: 'response',
      })
      .pipe(
        map((data) => data),
        take(1),
      );
    // return this.http.get(this.getPdfUrl + value, {}).pipe(take(1));
  }
  getDownloadPdfForCheque(value: any): Observable<any> {
    return this.http
      .get(this.getPdfForChequeUrl + value, {
        responseType: 'blob' as 'json',
        observe: 'response',
      })
      .pipe(
        map((data) => data),
        take(1),
      );
    // return this.http.get(this.getPdfUrl + value, {}).pipe(take(1));
  }
  getStatementDetail(value: any): Observable<object> {
    return this.http.get(this.getStatementDetailUrl + value, {});
  }
  getButton(statementNumber: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', statementNumber);
    return this.http.get(this.getButtonUrl, { params });
  }
}
