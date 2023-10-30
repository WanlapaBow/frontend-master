import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  NbDialogService,
  NbSidebarService,
  NbToastrService,
} from '@nebular/theme';
import { EditEmailComponent } from '../../components/edit-email/edit-email.component';
import { defaultCofDef, settingEmail } from './ag-gird.config';
import { EmailConfigService } from './email-config.service';

@Component({
  selector: 'ngx-email-config',
  templateUrl: './email-config.component.html',
  styleUrls: ['./email-config.component.scss'],
})
export class EmailConfigComponent implements OnInit {
  form: FormGroup;
  showPassword = false;
  loadingSignUp: boolean = false;
  loadingSave: boolean = false;
  columnLogDefs = settingEmail;
  defaultColDef = defaultCofDef;
  logData: any[] = [];
  context;
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
  rowSelection;
  paginationPageSize;
  sortingOrder: any;
  private gridApi;
  hostNameList: any[];
  tempSelect: any;
  constructor(
    private toastrService: NbToastrService,
    private service: EmailConfigService,
    private sidebarService: NbSidebarService,
    private dialogService: NbDialogService,
  ) {
    this.rowSelection = 'multiple';
    this.paginationPageSize = 10;
    this.sortingOrder = ['desc', 'asc'];
    this.sidebarService.compact('menu-sidebar');
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      emailSender: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      password: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
      hostName: new FormControl(
        { value: '', disabled: false },
        Validators.required,
      ),
    });
    this.context = { componentParent: this };
    this.getHostName();
    this.getLog();
  }

  getInputType() {
    if (this.showPassword) {
      return 'text';
    }
    return 'password';
  }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  getHostName() {
    this.service.getHostName().subscribe(
      (response: any[]) => {
        this.hostNameList = response['payload'];
      },
      (err) =>
        this.toastrService.show(err.message, err.textStatus, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
        }),
    );
  }
  onSubmit() {
    const encodePassword = window.btoa(this.form.value.password);

    const params = {
      email: this.form.value.emailSender,
      hostName: this.form.value.hostName,
      password: encodePassword,
    };
    this.service.signUpEmail(params).subscribe(
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
          setTimeout(() => {
            this.loadingSave = false;
          }, 1000);
          this.clearData();
          // this.gridHeaderApi.applyTransaction({add: res['status'].content});
          this.getLog();
        } else if (res['status'] === 'NOT_FOUND') {
          this.toastrService.show(res['errors'], this.toastrMsg.error.title, {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          });
          setTimeout(() => {
            this.loadingSave = false;
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
            this.loadingSave = false;
          }, 1000);
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
        this.loadingSave = false;
      },
    );
  }

  clearData() {
    this.form.get('emailSender').setValue('');
    this.form.get('hostName').setValue('');
    this.form.get('password').setValue('');
  }
  private getLog() {
    this.service.getLog().subscribe(
      (res) => {
        if (res['status'] === 'OK') {
          this.logData = res['payload'];
        } else {
          this.toastrService.show(
            this.toastrMsg.error.message,
            this.toastrMsg.error.title,
            {
              status: 'danger',
              duration: 5000,
              destroyByClick: true,
              limit: 1,
            },
          );
        }
      },
      (error) => {
        this.toastrService.show(error.message, this.toastrMsg.error.title, {
          status: 'danger',
          duration: 5000,
          destroyByClick: true,
          limit: 1,
        });
      },
    );
  }
  onGridLogReady(params: any) {
    // @ts-ignore
    this.gridLogApi = params.api;
    // @ts-ignore
    this.gridLogColumnApi = params.columnApi;
  }

  onEdit() {
    if (this.tempSelect !== undefined) {
      this.dialogService
        .open(EditEmailComponent, {
          context: {
            oldEmail: this.tempSelect,
          },
        })
        .onClose.subscribe((data) => {
          if (data) {
            const encodePassword = window.btoa(data.password);

            // this.isReceiptLoading = true;
            const params = {
              code: data.code,
              oldEmail: data.oldEmail,
              email: data.email,
              hostName: data.hostName,
              password: encodePassword,
            };
            this.service.editEmail(params).subscribe(
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
                  setTimeout(() => {
                    this.loadingSave = false;
                  }, 1000);
                  // this.gridHeaderApi.applyTransaction({add: res['status'].content});
                  this.getLog();
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
                    this.loadingSave = false;
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
                    this.loadingSave = false;
                  }, 1000);
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
                this.loadingSave = false;
              },
            );
          }
        });
    } else {
      alert('กรุณาเลือก email ที่จะแก้ไข');
    }
  }

  onSave() {
    const result = this.logData
      .filter((item) => item.isEnable === true)
      .map((item) => item.code);
    console.log(result);
    const param = {
      code: result,
    };
    this.loadingSave = true;
    this.service.updateFlag(param).subscribe(
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
          setTimeout(() => {
            this.loadingSave = false;
          }, 1000);
          // this.gridHeaderApi.applyTransaction({add: res['status'].content});
        } else if (res['status'] === 'NOT_FOUND') {
          this.toastrService.show(res['errors'], this.toastrMsg.error.title, {
            status: 'warning',
            duration: 5000,
            destroyByClick: true,
            limit: 1,
          });
          setTimeout(() => {
            this.loadingSave = false;
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
            this.loadingSave = false;
          }, 1000);
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
        this.loadingSave = false;
      },
    );
  }

  onCellValueChanged(event: any) {
    console.log(event);
  }

  onSelection(event: any) {
    if (event.type === 'selectionChanged') {
      const data = event.api.getSelectedRows()[0];
      this.tempSelect = Object.assign([], data);
    }
  }
}
