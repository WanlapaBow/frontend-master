import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class St001txSelectEmailSenderService {
  private getLogGLUrl: string =
    environment.apiUrl + 'api/v1/param/emailSenderNow';
  constructor(private http: HttpClient) {}

  getEmailSenderNow(): Observable<any> {
    console.log('xxxxxxx');
    return this.http.get(this.getLogGLUrl).pipe(take(1));
  }
}
