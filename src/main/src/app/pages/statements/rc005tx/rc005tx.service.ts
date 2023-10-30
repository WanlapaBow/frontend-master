import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rc005txService {
  private getInvoiceDetailUrl: string = environment.apiUrl + 'api/v1/receipts/';
  private postRecieptDeleteUrl: string =
    environment.apiUrl + 'api/v1/receipts/delete/';
  private serachReceiptUrl: string =
    environment.apiUrl + 'api/v1/param/receipts/';
  private getStatementUrl: string =
    environment.apiUrl + 'api/v1/param/statement/invoice/';
  private matchingReceiptUrl: string =
    environment.apiUrl + 'api/v1/statement/matchingReceipt';

  constructor(private http: HttpClient) {}

  getInvoiceDetailById(
    docNumber: any,
    limit: any,
    offset: any,
  ): Observable<object> {
    const params = new HttpParams().set('offset', offset).set('limit', limit);
    return this.http
      .get(this.getInvoiceDetailUrl + docNumber + '/invoice', { params })
      .pipe(take(1));
  }

  getReceipt(value: any): Observable<object> {
    let params = new HttpParams();
    if (value.receiptDateFrom.length > 0 && value.receiptDateTo.length > 0) {
      params = new HttpParams()
        .set('businessUnit', value.businessUnit)
        .set('customerClass', value.customerClass)
        .set('receiptDateForm', value.receiptDateFrom)
        .set('receiptDateTo', value.receiptDateTo);
      return this.http.get(this.serachReceiptUrl, { params }).pipe(take(1));
    } else if (
      value.receiptDateFrom.length > 0 &&
      value.receiptDateTo.length === 0
    ) {
      params = new HttpParams()
        .set('businessUnit', value.businessUnit)
        .set('customerClass', value.customerClass)
        .set('receiptDateForm', value.receiptDateFrom);
      return this.http.get(this.serachReceiptUrl, { params }).pipe(take(1));
    } else if (
      value.receiptDateTo.length > 0 &&
      value.receiptDateFrom.length === 0
    ) {
      params = new HttpParams()
        .set('businessUnit', value.businessUnit)
        .set('customerClass', value.customerClass)
        .set('receiptDateTo', value.receiptDateTo);
      return this.http.get(this.serachReceiptUrl, { params }).pipe(take(1));
    } else {
      params = new HttpParams()
        .set('businessUnit', value.businessUnit)
        .set('customerClass', value.customerClass);
      return this.http.get(this.serachReceiptUrl, { params }).pipe(take(1));
    }
  }

  postReceiptDelete(docNumber: any): Observable<object> {
    return this.http
      .post(this.postRecieptDeleteUrl + docNumber, {})
      .pipe(take(1));
  }

  getStatement(id: any): Observable<object> {
    return this.http.get(this.getStatementUrl + id, {}).pipe(take(1));
  }

  matchingReceipt(): Observable<object> {
    return this.http.post(this.matchingReceiptUrl, {}).pipe(take(1));
  }
}
