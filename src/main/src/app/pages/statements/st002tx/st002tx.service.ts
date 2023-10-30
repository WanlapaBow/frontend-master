import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class St002txService {
  private postValidateFileUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/upload/validate';
  private postConfirmFileUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/upload/confirmed';
  private logFileUrl: string =
    environment.apiUrl + 'api/v1/download/logs/download007-2';
  private getHeaderUrl: string = environment.apiUrl + 'api/v1/statement/';
  private getInvoiceUrl: string =
    environment.apiUrl + 'api/v1/statement/InvoiceNumber';
  private getHeaderByIdUrl: string = environment.apiUrl + 'api/v1/statement';
  private getLineUrl: string = environment.apiUrl + 'api/v1/statement/detail';
  private postConfirmUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/confirmed';
  private postCancelUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/cancel';
  private postDeductChangeUrl: string =
    environment.apiUrl + 'api/v1/statement/detail/deductwht';
  private getCsvTempUrl: string = environment.apiUrl + 'api/v1/download/excel'; // zip
  private getCsvTempKBankUrl: string =
    environment.apiUrl + 'api/v1/download/excelKBank'; // zip
  private getPDFTempUrl: string = environment.apiUrl + 'api/v1/download/pdf'; // pdf
  private getPDFTempKBankUrl: string =
    environment.apiUrl + 'api/v1/download/pdfKBank'; // pdf
  private getSendEmailUrl: string =
    environment.apiUrl + 'api/v1/statement/sendmail';

  constructor(private http: HttpClient) {}

  getSearchStatement(value: any, limit: any, offset: any): Observable<object> {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('status', value.status)
      .set('statementNumber', value.statementNumber)
      .set('customerCode', value.customerCode)
      .set('offset', offset)
      .set('limit', limit);
    return this.http.get(this.getHeaderUrl, { params }).pipe(take(1));
  }
  async getSearchStatement$(value: any, limit: any, offset: any) {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('status', value.status)
      .set('statementNumber', value.statementNumber)
      .set('customerCode', value.customerCode)
      .set('offset', offset)
      .set('limit', limit);
    return await this.http
      .get(this.getHeaderUrl, { params })
      .pipe(take(1))
      .toPromise();
  }

  async getSearchInvoice$(value: any, limit: any, offset: any) {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('customerName', value.customerName)
      .set('siteNumber', value.siteNumber)
      .set('invoiceNumber', value.invoiceNumber)
      .set('customerCode', value.customerCode)
      .set('offset', offset)
      .set('limit', limit);
    return await this.http
      .get(this.getInvoiceUrl, { params })
      .pipe(take(1))
      .toPromise();
  }

  getHeaderById(value: any): Observable<object> {
    return this.http
      .get(this.getHeaderByIdUrl + '/' + value.statementId, {})
      .pipe(take(1));
  }

  getLine(value: any): Observable<object> {
    return this.http.get(this.getLineUrl + '/' + value, {}).pipe(take(1));
  }
  async getLine$(value: any) {
    return await this.http
      .get(this.getLineUrl + '/' + value, {})
      .pipe(take(1))
      .toPromise();
  }

  uploadValidate(param: any): Observable<object> {
    const file = new FormData();
    file.append('files', param.file);
    return this.http.post(this.postValidateFileUrl, file).pipe(take(1));
  }

  uploadConfirm(param: any): Observable<object> {
    const file = new FormData();
    file.append('files', param.file);
    return this.http.post(this.postConfirmFileUrl, file).pipe(take(1));
  }

  postConfirm(body: any): Observable<object> {
    return this.http.post(this.postConfirmUrl, body).pipe(take(1));
  }

  getLogFile$(filename: string): Observable<any> {
    const params = new HttpParams().set('fileName', filename);
    return this.http
      .get(this.logFileUrl, {
        responseType: 'blob' as 'json',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => data),
        take(1),
      );
  }

  postCancelStatement(body: any): Observable<object> {
    return this.http.post(this.postCancelUrl, body).pipe(take(1));
  }

  postDeductWht(body: any): Observable<object> {
    return this.http.post(this.postDeductChangeUrl, body).pipe(take(1));
  }

  getDownloadCsv(value: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', value);
    return this.http
      .get(this.getCsvTempUrl, {
        responseType: 'blob',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => this._preDownloadXlsx(data)),
        take(1),
      );
    // window.open(this.getCsvTempUrl, '_blank');
  }

  getDownloadXlsxKBank(value: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', value);
    return this.http
      .get(this.getCsvTempKBankUrl, {
        responseType: 'blob',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => this._preDownloadXlsxKBank(data)),
        take(1),
      );
    // window.open(this.getCsvTempUrl, '_blank');
  }

  sendEmail(statementNumber: string, senderId: string): Observable<any> {
    const params = new HttpParams()
      .set('statementNumber', statementNumber)
      .set('emailSender', senderId);
    return this.http.get(this.getSendEmailUrl, { params }).pipe(take(1));
  }

  getDownloadPdf(value: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', value);
    return this.http
      .get(this.getPDFTempUrl, {
        responseType: 'blob',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => this._preDownloadPDF(data)),
        take(1),
      );
    // window.open(this.getPDFTempUrl + statementnumber, '_blank');
  }

  getDownloadPdfKBank(value: any): Observable<object> {
    const params = new HttpParams().set('statementNumber', value);
    return this.http
      .get(this.getPDFTempKBankUrl, {
        responseType: 'blob',
        observe: 'response',
        params,
      })
      .pipe(
        map((data) => this._preDownloadPDFKBank(data)),
        take(1),
      );
    // window.open(this.getPDFTempUrl + statementnumber, '_blank');
  }
  private _preDownloadXlsx(data): any {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const contentDispositionHeader = data.headers.get('Content-Disposition');
    if (contentDispositionHeader !== null) {
      const contentDispositionHeaderResult = contentDispositionHeader
        .split(';')[1]
        .trim()
        .split('=')[1];
      const contentDispositionFileName = contentDispositionHeaderResult.replace(
        /"/g,
        '',
      );
      if (contentDispositionFileName && contentDispositionHeaderResult) {
        return { blob, filename: contentDispositionFileName };
      } else {
        return { blob, filename: null };
      }
    } else {
      if (data.body.size > 0) {
        return { blob, filename: 'รายงานเบี้ย.zip' };
      } else {
        return { blob, filename: null };
      }
    }
    // const contentDisposition = data.headers.get('content-disposition') || '';
    // const matches = /filename=([^;]+)/gi.exec(contentDisposition);
    // if (matches != null && matches[1]) {
    //   const fileName = (matches[1] || 'untitled').trim();
    //   return { blob, filename: fileName };
    // } else {
    //   return { blob, filename: null };
    // }
  }
  private _preDownloadXlsxKBank(data): any {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const contentDispositionHeader = data.headers.get('Content-Disposition');
    if (contentDispositionHeader !== null) {
      const contentDispositionHeaderResult = contentDispositionHeader
        .split(';')[1]
        .trim()
        .split('=')[1];
      const contentDispositionFileName = contentDispositionHeaderResult.replace(
        /"/g,
        '',
      );
      if (contentDispositionFileName && contentDispositionHeaderResult) {
        return { blob, filename: contentDispositionFileName };
      } else {
        return { blob, filename: null };
      }
    } else {
      if (data.body.size > 0) {
        return { blob, filename: 'AR-Statement For KBank.xlsx' };
      } else {
        return { blob, filename: null };
      }
    }
    // const contentDisposition = data.headers.get('content-disposition') || '';
    // const matches = /filename=([^;]+)/gi.exec(contentDisposition);
    // if (matches != null && matches[1]) {
    //   const fileName = (matches[1] || 'untitled').trim();
    //   return { blob, filename: fileName };
    // } else {
    //   return { blob, filename: null };
    // }
  }
  private _preDownloadPDF(data): any {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const contentDispositionHeader = data.headers.get('Content-Disposition');
    if (contentDispositionHeader !== null) {
      const contentDispositionHeaderResult = contentDispositionHeader
        .split(';')[1]
        .trim()
        .split('=')[1];
      const contentDispositionFileName = contentDispositionHeaderResult.replace(
        /"/g,
        '',
      );
      if (contentDispositionFileName && contentDispositionHeaderResult) {
        return { blob, filename: contentDispositionFileName };
      } else {
        return { blob, filename: null };
      }
    } else {
      if (data.body.size > 0) {
        return {
          blob,
          filename: 'ใบแจ้งการชำระเงินและรายการเบี้ยประกันภัย.pdf',
        };
      } else {
        return { blob, filename: null };
      }
    }
  }
  private _preDownloadPDFKBank(data): any {
    const blob = new Blob([data.body], {
      type: data.headers.get('content-type'),
    });
    const contentDispositionHeader = data.headers.get('Content-Disposition');
    if (contentDispositionHeader !== null) {
      const contentDispositionHeaderResult = contentDispositionHeader
        .split(';')[1]
        .trim()
        .split('=')[1];
      const contentDispositionFileName = contentDispositionHeaderResult.replace(
        /"/g,
        '',
      );
      if (contentDispositionFileName && contentDispositionHeaderResult) {
        return { blob, filename: contentDispositionFileName };
      } else {
        return { blob, filename: null };
      }
    } else {
      if (data.body.size > 0) {
        return {
          blob,
          filename: 'AR-Statement For KBank.pdf',
        };
      } else {
        return { blob, filename: null };
      }
    }
  }
}
