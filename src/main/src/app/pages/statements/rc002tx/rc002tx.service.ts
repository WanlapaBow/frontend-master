import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rc002txService {
  private getHeaderUrl: string = environment.apiUrl + 'api/v1/statement/';
  private getRecieptDetailUrl: string =
    environment.apiUrl + 'api/v1/receipts/manage/';
  private getInvoiceDetailUrl: string =
    environment.apiUrl + 'api/v1/receipts/manage/';
  private postRecieptDeleteUrl: string =
    environment.apiUrl + 'api/v1/receipts/delete/';
  private postCompleteUrl: string =
    environment.apiUrl + 'api/v1/statement/completed';
  private postInCompleteUrl: string =
    environment.apiUrl + 'api/v1/statement/incompleted';
  private matchingReceiptUrl: string =
    environment.apiUrl + 'api/v1/statement/matchingReceipt';
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
    return this.http.get(this.getHeaderUrl, { params });
  }

  async getSearchStatement$(value: any) {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('status', value.status)
      .set('statementNumber', value.statementNumber)
      .set('customerCode', value.customerCode);
    return await this.http.get(this.getHeaderUrl, { params }).toPromise();
  }
  getSearchStatementDetail(value: any): Observable<object> {
    return this.http.get(this.getHeaderUrl + value, {});
  }

  getRecieptDetailById(value: any): Observable<object> {
    return this.http
      .get(this.getRecieptDetailUrl + value + '/receipts', {})
      .pipe(take(1));
  }
  getInvoiceDetailById(value: any): Observable<object> {
    return this.http
      .get(this.getInvoiceDetailUrl + value + '/invoice', {})
      .pipe(take(1));
  }
  async getInvoiceDetailById$(value: any) {
    return await this.http
      .get(this.getInvoiceDetailUrl + value + '/invoice', {})
      .pipe(take(1))
      .toPromise();
  }
  postReceiptDelete(docNumber: any): Observable<object> {
    return this.http
      .post(this.postRecieptDeleteUrl + docNumber, {})
      .pipe(take(1));
  }
  postCompleteStd(stdNumber: any): Observable<object> {
    const param = {
      statementNumber: stdNumber,
    };
    return this.http.post(this.postCompleteUrl, param).pipe(take(1));
  }
  postInCompleteStd(stdNumber: any): Observable<object> {
    const param = {
      statementNumber: stdNumber,
    };
    return this.http.post(this.postInCompleteUrl, param).pipe(take(1));
  }
  matchingReceipt(): Observable<object> {
    return this.http.post(this.matchingReceiptUrl, {}).pipe(take(1));
  }
  getButton(statementNumber: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', statementNumber);
    return this.http.get(this.getButtonUrl, { params });
  }
}
