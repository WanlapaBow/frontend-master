import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterfaceAllService {
  private postSyncGLUrl: string = environment.apiUrl + 'api/v1/loadplan/';
  private getLogGLUrl: string = environment.apiUrl + 'api/v1/loadplan/logs';
  private getDownLoadUrl: string =
    environment.apiUrl + 'api/v1/loadplan/logs/download';

  constructor(private http: HttpClient) {}

  syncGL(body: any): Observable<object> {
    return this.http.post(this.postSyncGLUrl, body).pipe(take(1));
  }

  getLog(index: any, limit: any, xcust: any): Observable<object> {
    const params = new HttpParams()
      .set('custId', xcust)
      .set('offset', index)
      .set('limit', limit);
    return this.http.get(this.getLogGLUrl, { params }).pipe(take(1));
  }

  getDownloadLog(instanceId: any): void {
    window.open(this.getDownLoadUrl + '?instanceId=' + instanceId, '_blank');
  }
}
