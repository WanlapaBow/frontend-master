import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EditEmailService {
  private getLogGLUrl: string = environment.apiUrl + 'api/v1/param/emailSender';
  private getHostNameUrl: string = environment.apiUrl + 'api/v1/param/emailHostName';
  private postUpdateFlag: string = environment.apiUrl + 'api/v1/statement/updateFlagEmail';
  constructor(private http: HttpClient) {}

  getLog(): Observable<object> {
    return this.http.get(this.getLogGLUrl).pipe(take(1));
  }

  getHostName(): Observable<object> {
    return this.http.get(this.getHostNameUrl).pipe(take(1));
  }

  updateFlag(value: any): Observable<object> {
    return this.http.post(this.postUpdateFlag, value).pipe(take(1));
  }
}
