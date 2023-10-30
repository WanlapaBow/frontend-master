import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Rc007txService {
  private getStatementHeaderUrl: string =
    environment.apiUrl + 'api/v1/statement/';
  private getStatementByIdUrl: string =
    environment.apiUrl + 'api/v1/statement/';
  private getWhtAdvUrl: string = environment.apiUrl + 'api/v1/advWhtCert/';
  private postAdvWhtCertCreate: string =
    environment.apiUrl + 'api/v1/advWhtCert/create';
  private postAdvWhtCertCancel: string =
    environment.apiUrl + 'api/v1/advWhtCert/cancel';
  private getPdfUrl: string =
    environment.apiUrl + 'api/v1/advWhtCert/report/pdf/';
  private getButtonUrl: string =
    environment.apiUrl + 'api/v1/statement/button/advanceWhtCer';

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

  async getSearchStatement$(value: any) {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('status', value.status)
      .set('statementNumber', value.statementNumber)
      .set('customerCode', value.customerCode);
    return await this.http
      .get(this.getStatementHeaderUrl, { params })
      .toPromise();
  }

  getReceiptAdv$(value: any) {
    const params = new HttpParams().set('statementNumber', value);
    return this.http
      .get(this.getWhtAdvUrl, { params })
      .pipe(take(1))
      .toPromise();
  }

  postReceiptAdvCreate(body: any): Observable<object> {
    return this.http.post(this.postAdvWhtCertCreate, body).pipe(take(1));
  }

  postWhtAdvCancel(value: any): Observable<object> {
    return this.http.post(this.postAdvWhtCertCancel, value).pipe(take(1));
  }

  getDownloadPdf(statementnumber: any): void {
    window.open(this.getPdfUrl + statementnumber, '_blank');
  }

  getStatementById(value: any): Observable<object> {
    return this.http.get(this.getStatementByIdUrl + value, {}).pipe(take(1));
  }
  getButton(statementNumber: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', statementNumber);
    return this.http.get(this.getButtonUrl, { params });
  }
}
