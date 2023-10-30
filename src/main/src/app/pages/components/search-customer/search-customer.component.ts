import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { take } from 'rxjs/operators';
import { CommonService } from '../../../_helpers/common.service';

@Component({
  selector: 'ngx-search-customer',
  templateUrl: './search-customer.component.html',
  styleUrls: ['./search-customer.component.scss'],
})
export class SearchCustomerComponent implements OnInit {
  @Input() customerClass: string;
  @Input() customerSubClass: string;
  customerList: {
    customerName: string;
    siteNumber: string;
    customerCode: string;
  }[] = [];
  // FormGroup
  form: FormGroup;
  isDisable: boolean = false;
  isShowList: boolean = false;
  loading: boolean = false;

  constructor(
    protected ref: NbDialogRef<SearchCustomerComponent>,
    public commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      customerClass: new FormControl(
        { value: this.customerClass, disabled: this.isDisable },
        Validators.required,
      ),
      customerSubClass: new FormControl({ value: this.customerSubClass, disabled: false }),
      customerName: new FormControl(
        { value: '', disabled: this.isDisable },
        Validators.required,
      ),
      customerCode: new FormControl(
        { value: '', disabled: this.isDisable },
        Validators.required,
      ),
      siteNumber: new FormControl(
        { value: '', disabled: this.isDisable },
        Validators.required,
      ),
    });
  }

  onSelect(value: any) {
    this.ref.close(value);
  }

  onSearch(type: any) {
    this.loading = true;
    this.customerList = [];
    this.form.value.customerClass = this.customerClass;
    // console.log(this.customerClass)
    this.commonService
      .getCustomer(this.form.value)
      .pipe(take(1))
      .subscribe(
        (response: any) => {
          if (response.payload.length > 0) {
            this.customerList = response.payload;
            this.isShowList = true;
          } else {
            this.isShowList = false;
          }
          setTimeout(() => {
            // this.isShowList = true;
            this.loading = false;
          }, 2000);
        },
        (err) => console.error(err),
      );
  }

  dismiss() {
    this.ref.close();
  }
}
