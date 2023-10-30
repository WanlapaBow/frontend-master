import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rc004txService {
  private getInvoiceDetailUrl: string =
    environment.apiUrl + 'api/v1/receipts/create/';
  // private getInvoiceDetailByDocNoUrl: string = environment.apiUrl + 'api/v1/receipts/';
  private postReceiptCreateUrl: string =
    environment.apiUrl + 'api/v1/receipts/create';

  constructor(private http: HttpClient) {}
  getInvoiceDetailById(docNumber: any): Observable<object> {
    return (
      this.http
        // .get(this.getInvoiceDetailByDocNoUrl + docNumber + '/invoice', {})
        .get(this.getInvoiceDetailUrl + docNumber + '/invoice', {})
        .pipe(take(1))
    );
  }
  postReceiptCreate(body: any): Observable<object> {
    return this.http.post(this.postReceiptCreateUrl, body).pipe(take(1));
  }
}
