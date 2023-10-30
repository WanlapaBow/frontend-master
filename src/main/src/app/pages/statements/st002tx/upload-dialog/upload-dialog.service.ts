import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadDialogService {
  private getLogGLUrl: string = environment.apiUrl + 'api/v1/report/logs';
  private postValidateFileUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/upload/validateSchedule';
  private postConfirmUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/upload/ConfirmedSchedule';

  constructor(private http: HttpClient) {}
  getLog(index: any, limit: any): Observable<object> {
    const params = new HttpParams()
      .set('offset', index)
      .set('limit', limit)
      .set('reportName', 'UploadFileStatement CSV');
    return this.http.get(this.getLogGLUrl, { params }).pipe(take(1));
  }

  confirm(jobId: any): Observable<object> {
    const params = new HttpParams().set('jobId', jobId);
    return this.http.post(this.postConfirmUrl, params).pipe(take(1));
  }

  uploadValidate(param: any): Observable<object> {
    const file = new FormData();
    file.append('files', param.file);
    return this.http.post(this.postValidateFileUrl, file).pipe(take(1));
  }
}
