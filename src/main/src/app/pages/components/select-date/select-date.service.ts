import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SelectDateService {
  private getCheckPeriodAccountUrl: string =
    environment.apiUrl + 'api/v1/receipts/checkPeriod';
  constructor(private http: HttpClient) {}

  getCheckPeriod(accountingDate: any): Observable<object> {
    const params = new HttpParams().set('accountingDate', accountingDate);
    return this.http
      .get(this.getCheckPeriodAccountUrl, { params })
      .pipe(take(1));
  }
}
