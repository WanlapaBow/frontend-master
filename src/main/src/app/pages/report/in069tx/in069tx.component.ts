import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbSidebarService } from '@nebular/theme';
import { CommonService } from '../../../_helpers/common.service';
import { In069txService } from './in069tx.service';

@Component({
  selector: 'ngx-in069tx',
  templateUrl: './in069tx.component.html',
  styleUrls: ['./in069tx.component.scss'],
})
export class In069txComponent implements OnInit {
  form: FormGroup;
  isLoading: boolean = false;

  constructor(
    public commonService: CommonService,
    public service: In069txService,
    private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.compact('menu-sidebar');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      businessUnit: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
    });
  }

  exportReport() {
    this.isLoading = true;
    this.service.getDownloadCsv(this.form.value.businessUnit);
    this.isLoading = false;
  }
}
