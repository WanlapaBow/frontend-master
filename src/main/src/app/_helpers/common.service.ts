import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {NbToastrService} from '@nebular/theme';
import {Observable} from 'rxjs';
import {
  take,
} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  apiUrl: string = environment.apiUrl;
  // end point
  endpoint = {
    getBussinessURL: this.apiUrl + 'api/v1/param/statement/businessMasters',
    getCustomerClassURL: this.apiUrl + 'api/v1/param/statement/customerClass',
    getCustomerSubClassURL: this.apiUrl + 'api/v1/param/statement/customerSubClass',
    getPaymentCalendarURL: this.apiUrl + 'api/v1/param/statement/paymentCalendar',
    getPaymentPeriodURL: this.apiUrl + 'api/v1/param/statement/paymentPeriod',
    getPaymentDueDateURL: this.apiUrl + 'api/v1/param/statement/dueDate',
    getStatementStatusURL: this.apiUrl + 'api/v1/param/statement/statementstatus',
    getStatementNumberURL: this.apiUrl + 'api/v1/param/statement/statementnumber',
    getReceiptMethodURL: this.apiUrl + 'api/v1/param/receipt/method',
    getSearchCustomerUrl: this.apiUrl + 'api/v1/param/statement/searchCustomer',
    getSearchReceiptByStatementNoUrl: this.apiUrl + 'api/v1/param/receipt/search/statementnumber',
    getStatementNumberGLURL: this.apiUrl + 'api/v1/param/in0077/statementNumber',
    getTaxInvoiceNum: this.apiUrl + 'api/v1/param/advancereceipt/taxinvoicenumber',
    getAdvanceReceiptStatusURL: this.apiUrl + 'api/v1/param/advancereceipt/status',


  };
  // Results
  businessUnitList: any[];
  customerClassList: any[];
  customerSubClassList: any[];
  paymentCalendarList: any[];
  paymentPeriodList: any[];
  statementStatusList: any[];
  receiptMethodList: any[];
  advanceReceiptStatusList: any[];

  // statementNumberList: any[];

  constructor(private http: HttpClient, private toastrService: NbToastrService) {
    this.getBussinessUnit();
    this.getCustomerClass();
    // this.getCustomerSubClass();
    this.getPaymentCalendar();
    this.getStatementStatus();
    this.getReceiptMethod();
    this.getAdvanceReceiptStatus();
  }

  getBussinessUnit() {
    return this.http
      .get(this.endpoint.getBussinessURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.businessUnitList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }

  getCustomerClass() {
    return this.http
      .get(this.endpoint.getCustomerClassURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.customerClassList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }
  getCustomerSubClass() {
    return this.http
      .get(this.endpoint.getCustomerSubClassURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.customerSubClassList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }

  getCustomerSubClassSearch(code: string): Observable<any> {
    const params = new HttpParams()
      .set('customerClass', code);
    return this.http
      .get(this.endpoint.getCustomerSubClassURL, {
        responseType: 'json', params,
      });
  }
  getPaymentCalendar() {
    return this.http
      .get(this.endpoint.getPaymentCalendarURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.paymentCalendarList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }

  getPaymentPeriodByCode$(code: string): Observable<any> {
    const params = new HttpParams()
      .set('code', code);
    return this.http
      .get(this.endpoint.getPaymentPeriodURL, {
        responseType: 'json', params,
      });
  }

  getPaymentPeriodByCode(code: string) {
    const params = new HttpParams()
      .set('code', code);
    return this.http
      .get(this.endpoint.getPaymentCalendarURL, {
        responseType: 'json', params,
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.paymentPeriodList = response;
        },
        (err) => console.error(err),
      );
  }

  getPaymentDueDateByCalendarAndCode$(value: any): Observable<any> {
    const params = new HttpParams()
      .set('codePaymentCalendar', value.code)
      .set('codePaymentPeriod', value.paymentPeriod);
    return this.http
      .get(this.endpoint.getPaymentDueDateURL, {
        responseType: 'json', params,
      });
  }

  getStatementStatus() {
    return this.http
      .get(this.endpoint.getStatementStatusURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.statementStatusList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }
  getStatementNumber$(value: any): Observable<any> {
    const params = new HttpParams()
      .set('statementnumber', value);
    return this.http
      .get(this.endpoint.getStatementNumberURL, {
        responseType: 'json', params,
      });
  }
  getStatementNumberGL$(value: any): Observable<any> {
    const params = new HttpParams()
      .set('statementNumber', value);
    return this.http
      .get(this.endpoint.getStatementNumberGLURL, {
        responseType: 'json', params,
      });
  }
  getReceiptStatementNumber$(value: any): Observable<any> {
    const params = new HttpParams()
      .set('businessUnit', value.businessUnit)
      .set('customerClass', value.customerClass)
      .set('statementNumber', value.statementNumber);
    return this.http
      .get(this.endpoint.getSearchReceiptByStatementNoUrl, {
        responseType: 'json', params,
      });
  }
  getReceiptMethod() {
    return this.http
      .get(this.endpoint.getReceiptMethodURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.receiptMethodList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }
  getCustomer(value: any): Observable<object> {
    let params: HttpParams;
    // if (value.customerCode.length > 0) {
    //   params = new HttpParams()
    //     .set('customerClass', value.customerClass)
    //     .set('customerCode', value.customerCode);
    // }
    // if (value.customerName.length > 0) {
    //   params = new HttpParams()
    //     .set('customerClass', value.customerClass)
    //     .set('customerName', value.customerName);
    // }
    // if (value.siteNumber.length > 0) {
    //   params = new HttpParams()
    //     .set('customerClass', value.customerClass)
    //     .set('siteNumber', value.siteNumber);
    // }
    //
    // if (value.customerCode.length > 0 && value.customerName.length > 0) {
    //   params = new HttpParams()
    //     .set('customerClass', value.customerClass)
    //     .set('customerCode', value.customerCode)
    //     .set('customerName', value.customerName);
    // }
    // if (value.customerName.length > 0 && value.siteNumber.length > 0) {
    //   params = new HttpParams()
    //     .set('customerClass', value.customerClass)
    //     .set('siteNumber', value.siteNumber)
    //     .set('customerName', value.customerName);
    // }
    // if (value.customerCode.length > 0 && value.customerName.length > 0 && value.siteNumber.length > 0) {
      params = new HttpParams()
        .set('customerClass', value.customerClass)
        .set('customerSubClass', value.customerSubClass)
        .set('customerCode', value.customerCode)
        .set('customerName', value.customerName)
        .set('siteNumber', value.siteNumber);
    // }
    // console.log(params)
    return this.http.get(this.endpoint.getSearchCustomerUrl, {params});
  }
  bytesToSize(bytes: number) {
    const k = 1024;
    const dm = 2 < 0 ? 0 : 2;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  getTaxInvoiceNum(value: any): Observable<any> {
    const params = new HttpParams()
      // .set('statementNumber', value.statementNumber)
      .set('taxInvoiceNumber', value.receiptOrTaxInvoiceNumber);
    return this.http
      .get(this.endpoint.getTaxInvoiceNum, {
        responseType: 'json', params,
      });
  }
  getAdvanceReceiptStatus() {
    return this.http
      .get(this.endpoint.getAdvanceReceiptStatusURL, {
        responseType: 'json',
      })
      .pipe(take(1))
      .subscribe(
        (response: any[]) => {
          this.advanceReceiptStatusList = response['payload'];
        },
        (err) => this.toastrService.show(err.message,
          err.textStatus, {
            status: 'danger',
            duration: 5000,
            destroyByClick: true,
          }),
      );
  }
}
