import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NbDialogService, NbToastrService,
} from '@nebular/theme';
import {
  defaultColDef,
  paginationPageSize,
  rowSelection,
  settingEmail,
} from './ag-gird.config';
import { ConfirmDeleteComponent } from './confirm-delete/confirm-delete.component';
import { ConfirmEditComponent } from './confirm-edit/confirm-edit.component';
import { EmailSetupService } from './email-setup.service';

@Component({
  selector: 'ngx-email-setup',
  templateUrl: './email-setup.component.html',
  styleUrls: ['./email-setup.component.scss'],
})
export class EmailSetupComponent implements OnInit {
  form: FormGroup;
  emailGroupList: any[];
  loadingSearch: boolean = false;
  loading: boolean = false;

  isLoading: boolean = false;

  isCreate: boolean = false;
  isSearch: boolean = true;
  isOnSearch: boolean = false;

  enableButton: boolean = false;

  toastrMsg = {
    waiting: {
      message: 'กำลังค้นหาข้อมูล',
      title: 'กำลังค้นหา',
    },
    noData: {
      message: 'ไม่พบข้อมูล',
      title: 'ไม่พบข้อมูล',
    },
    noFile: {
      message: 'ไม่พบข้อมูลไฟล์',
      title: 'ไม่สำเร็จ',
    },
    searchSuccess: {
      message: 'ค้นหาข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    saveSuccess: {
      message: 'บันทึกข้อมูลสำเร็จ',
      title: 'สำเร็จ',
    },
    error: {
      message: 'ค้นหาข้อมูลไม่สำเร็จ',
      title: 'ไม่สำเร็จ',
    },
  };

  rowData: any[] = [];
  columnLogDefs = settingEmail;
  defaultColDef = defaultColDef;
  rowSelection = rowSelection;
  paginationPageSize = paginationPageSize;
  currentPage = 0;
  totalPages;
  sizeList: any[] = ['10', '20', '50'];
  tooltipShowDelay = 0;
  context;
  sortingOrder: any;

  private gridApi;
  gridColumnApi;
  formSizePage: FormGroup;
  tempSelect: any;

  constructor(
    private toastrService: NbToastrService,
    private service: EmailSetupService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      emailGroup: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      emailNew: new FormControl({ value: '', disabled: false }),
      emailGroupNew: new FormControl({ value: '', disabled: false }),
    });
    this.context = { componentParent: this };
    this.sortingOrder = ['desc', 'asc'];
    this.getEmailGroup();
  }
  createEmail() {
    this.loading = true;
    const toastRef = this.toastrService.show('waiting', 'Loading', {
      status: 'warning',
    });

    this.service.createEmail(this.form.value).subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.toastrService.show(
            this.toastrMsg.saveSuccess.message,
            this.toastrMsg.saveSuccess.title,
            {
              status: 'success',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
          setTimeout(() => { }, 1000);
          this.clearData();
          // this.gridHeaderApi.applyTransaction({add: res['status'].content});
        } else if (res['status'] === 'NOT_FOUND') {
          this.toastrService.show(res['errors'], this.toastrMsg.error.title, {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          });
          setTimeout(() => { }, 1000);
        } else if (res['status'] === 'BAD_REQUEST') {
          alert('ข้อมูลซ้ำซ้อน');
        }
      },
      (error) => {
        if (error.status === 404) {
          this.toastrService.show(
            this.toastrMsg.noData.message,
            this.toastrMsg.noData.title,
            {
              status: 'warning',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title + error.status,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        }
      },
    );
    toastRef.close();
    this.loading = false;
  }

  searchEmail() {
    const toastRef = this.toastrService.show('waiting', 'Loading', {
      status: 'warning',
    });
    this.loadingSearch = true;
    const formData = {
      email: this.form.value.email,
      emailGroup: this.form.value.emailGroup,
    };
    this.rowData = [];
    // console.log(this.form)
    this.service.getEmail(formData).subscribe((responce: any) => {
      this.toastrService.show('waiting', 'Loading', {
        status: 'success',
        duration: 5000,
      });
      if (
        responce['status'] === 'OK' &&
        responce['payload'].content.length > 0
      ) {
        // this.isShowEdit = true;
        this.rowData = responce['payload'].content;
        this.totalPages = responce.payload.totalPages;
        this.isOnSearch = true;
        // } else if (responce['status'] === 'BAD_REQUEST') {
        //   alert('กรุณากรอก Parameter ให้ถูกต้อง');
      } else if (responce['status'] === 'BAD_REQUEST') {
        alert('ไม่พบข้อมูล');
      }
      toastRef.close();
      this.loadingSearch = false;
    });
  }

  clearData() {
    this.form.get('email').setValue('');
    this.form.get('emailGroup').setValue('');
    this.form.get('emailNew').setValue('');
    this.form.get('emailGroupNew').setValue('');
    this.isOnSearch = false;
    this.rowData = [];
  }

  getEmailGroup() {
    this.service.getEmailGroup().subscribe(
      (response: any[]) => {
        this.emailGroupList = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }

  searchPage() {
    this.isSearch = true;
    this.isCreate = false;
  }
  createPage() {
    this.isSearch = false;
    this.isCreate = true;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.getLog(this.currentPage, this.paginationPageSize);
  }
  onSelection(event: any) {
    if (event.type === 'selectionChanged') {
      const data = event.api.getSelectedRows()[0];
      this.tempSelect = Object.assign([], data);
    }
  }

  onClearEmail() {
    this.form.get('email').setValue('');
  }

  onDelelte() {
    if (this.tempSelect !== undefined) {
      this.dialogService
        .open(ConfirmDeleteComponent, {
          context: {
            temp: this.tempSelect,
          },
        })
        .onClose.subscribe((data) => {
          if (data) {
            this.loading = true;
            const params = {
              email: data.email,
              emailGroup: data.emailGroup,
            };
            this.service.deleteEmail(params).subscribe(
              (res) => {
                if (res['status'] === 'OK') {
                  this.toastrService.show(
                    this.toastrMsg.saveSuccess.message,
                    this.toastrMsg.saveSuccess.title,
                    {
                      status: 'success',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                  this.searchEmail();
                  setTimeout(() => {
                    // this.loadingSave = false;
                  }, 1000);
                  // this.gridHeaderApi.applyTransaction({add: res['status'].content});
                } else if (res['status'] === 'NOT_FOUND') {
                  this.toastrService.show(
                    res['errors'],
                    this.toastrMsg.error.title,
                    {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                  setTimeout(() => {
                    // this.loadingSave = false;
                  }, 1000);
                } else {
                  this.toastrService.show(
                    this.toastrMsg.noData.message,
                    this.toastrMsg.noData.title,
                    {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                  setTimeout(() => {
                    // this.loadingSave = false;
                  }, 1000);
                }
                this.loading = false;
              },
              (error) => {
                if (error.status === 404) {
                  this.toastrService.show(
                    this.toastrMsg.noData.message,
                    this.toastrMsg.noData.title,
                    {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                } else {
                  this.toastrService.show(
                    this.toastrMsg.error.message,
                    this.toastrMsg.error.title + error.status,
                    {
                      status: 'danger',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                }
                this.loading = false;
              },
            );
          }
        });
      this.tempSelect = undefined;
    } else {
      alert('กรุณาเลือก email ที่จะลบ');
    }
  }

  onEdit() {
    if (this.tempSelect !== undefined) {
      this.dialogService
        .open(ConfirmEditComponent, {
          context: {
            temp: this.tempSelect,
            emailGroupList: this.emailGroupList,
          },
        })
        .onClose.subscribe((data) => {
          if (data) {
            this.loading = true;
            // this.isReceiptLoading = true;
            const params = {
              email: data.email,
              emailGroup: data.emailGroup,
              emailNew: data.emailNew,
              emailGroupNew: data.emailGroupNew,
            };
            this.service.updateEmail(params).subscribe(
              (res) => {
                if (res['status'] === 'OK') {
                  this.toastrService.show(
                    this.toastrMsg.saveSuccess.message,
                    this.toastrMsg.saveSuccess.title,
                    {
                      status: 'success',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                  this.searchEmail();
                  setTimeout(() => {
                    // this.loadingSave = false;
                  }, 1000);

                  // this.gridHeaderApi.applyTransaction({add: res['status'].content});
                } else if (res['status'] === 'BAD_REQUEST') {
                  alert('ข้อมูลซ้ำซ้อน');
                } else if (res['status'] === 'NOT_FOUND') {
                  this.toastrService.show(
                    res['errors'],
                    this.toastrMsg.error.title,
                    {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                  setTimeout(() => {
                    // this.loadingSave = false;
                  }, 1000);
                } else {
                  this.toastrService.show(
                    this.toastrMsg.noData.message,
                    this.toastrMsg.noData.title,
                    {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                  setTimeout(() => {
                    // this.loadingSave = false;
                  }, 1000);
                }
                this.loading = false;
              },
              (error) => {
                if (error.status === 404) {
                  this.toastrService.show(
                    this.toastrMsg.noData.message,
                    this.toastrMsg.noData.title,
                    {
                      status: 'warning',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                } else {
                  this.toastrService.show(
                    this.toastrMsg.error.message,
                    this.toastrMsg.error.title + error.status,
                    {
                      status: 'danger',
                      duration: 5000,
                      destroyByClick: true,
                      limit: 1,
                    },
                  );
                }
                this.loading = false;
              },
            );
          }
        });
      this.tempSelect = undefined;
    } else {
      alert('กรุณาเลือก email ที่จะ Update');
    }
  }
}
