import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class In079txService {
  private getPropIdLogUrl: string =
    environment.apiUrl + 'api/v1/receipts/getIn079';
  private postUpdataUrl: string =
    environment.apiUrl + 'api/v1/receipts/updatePropId';
  private getReceiptMethodUrl: string =
    environment.apiUrl + 'api/v1/param/getReceiptMethod';
  private getPartyNamedUrl: string =
    environment.apiUrl + 'api/v1/param/getAgentName';
  private getPartyNumberUrl: string =
    environment.apiUrl + 'api/v1/param/getAgentNumber';
  private getReceiptNumberUrl: string =
    environment.apiUrl + 'api/v1/param/getReceiptNumber';
  private getBankAccoutUrl: string =
    environment.apiUrl + 'api/v1/param/getBankAccountName';

  constructor(private http: HttpClient) {}

  getPropIdLog(param: any): Observable<object> {
    return this.http.post(this.getPropIdLogUrl, param).pipe(take(1));
  }

  getUpdate(param: any): Observable<object> {
    return this.http.post(this.postUpdataUrl, param).pipe(take(1));
  }

  getReceiptMethod(): Observable<any> {
    return this.http.get(this.getReceiptMethodUrl).pipe(take(1));
  }

  getPartyName(params: any): Observable<any> {
    return this.http.get(this.getPartyNamedUrl, { params }).pipe(take(1));
  }

  getPartyNumber(params: any): Observable<any> {
    return this.http.get(this.getPartyNumberUrl, { params }).pipe(take(1));
  }

  getReceiptNumber(params: any): Observable<any> {
    return this.http.get(this.getReceiptNumberUrl, { params }).pipe(take(1));
  }

  getBankAccount(params: any): Observable<any> {
    return this.http.get(this.getBankAccoutUrl, { params }).pipe(take(1));
  }
}
