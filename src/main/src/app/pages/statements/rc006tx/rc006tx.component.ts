import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbSidebarService } from '@nebular/theme';
import { CommonService } from '../../../_helpers/common.service';
@Component({
  selector: 'ngx-rc006tx',
  templateUrl: './rc006tx.component.html',
  styleUrls: ['./rc006tx.component.scss'],
})
export class Rc006txComponent implements OnInit {
  formFilter: FormGroup;

  constructor(
    public commonService: CommonService,
    private sidebarService: NbSidebarService,
  ) {
    this.sidebarService.compact('menu-sidebar');
  }

  ngOnInit(): void {
    this.formFilter = new FormGroup({
      businessUnit: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      customerClass: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
    });
  }
}
