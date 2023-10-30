import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmailSetupService {
  private emailGroupUrl: string =
    environment.apiUrl + 'api/v1/email/getEmailGroup';
  private createEmailUrl: string =
    environment.apiUrl + 'api/v1/email/createEmail';
  private emailAllUrl: string = environment.apiUrl + 'api/v1/email/getEmail';
  private updateEmailUrl: string =
    environment.apiUrl + 'api/v1/email/updateEmail';
  private deleteEmailUrl: string =
    environment.apiUrl + 'api/v1/email/deleteEmail';

  constructor(private http: HttpClient) {}

  getEmailGroup(): Observable<object> {
    return this.http.get(this.emailGroupUrl).pipe(take(1));
  }

  createEmail(value: any): Observable<object> {
    return this.http.post(this.createEmailUrl, value).pipe(take(1));
  }

  updateEmail(value: any): Observable<object> {
    return this.http.post(this.updateEmailUrl, value).pipe(take(1));
  }

  getEmail(params: any): Observable<any> {
    return this.http.get(this.emailAllUrl, { params }).pipe(take(1));
  }

  deleteEmail(params: any): Observable<any> {
    return this.http.delete(this.deleteEmailUrl, { params }).pipe(take(1));
  }
}
