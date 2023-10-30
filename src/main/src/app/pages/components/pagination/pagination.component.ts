import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  // @Input() currentPage: any;
  @Input() totalPages: any;
  @Input() pageSize: any;
  @Input() isFirstPage: any;
  @Input() isLastPage: any;
  @Output() onTest = new EventEmitter<string>();
  @Output() onPageSizeChanged = new EventEmitter<string>();
  @Output() onBtFirst = new EventEmitter<string>();
  @Output() onBtNext = new EventEmitter<string>();
  @Output() onBtPrevious = new EventEmitter<string>();
  @Output() onBtLast = new EventEmitter<string>();
  currentPage: number = 0;
  formSizePage: FormGroup;
  sizeList: any[] = ['1', '5', '10', '20', '50'];

  constructor() {}

  ngOnInit(): void {
    this.formSizePage = new FormGroup({
      pageSize: new FormControl(this.pageSize.toString(), Validators.required),
    });
  }

  onFirst() {
    this.currentPage = 0;
    if (!this.isFirstPage) {
      const resultData: any = {
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        paginationPageSize: this.formSizePage.value.pageSize,
      };
      this.onBtFirst.emit(resultData);
    }
  }

  onPrevious() {
    if (this.currentPage > 0) {
      this.currentPage = this.currentPage - 1;
      const resultData: any = {
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        paginationPageSize: this.formSizePage.value.pageSize,
      };
      this.onBtPrevious.emit(resultData);
    }
  }

  onNext() {
    this.currentPage =
      this.currentPage + 1 <= this.totalPages - 1
        ? this.currentPage + 1
        : this.currentPage;
    if (this.currentPage <= this.totalPages - 1 && this.isLastPage !== true) {
      const resultData: any = {
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        paginationPageSize: this.formSizePage.value.pageSize,
      };
      this.onBtNext.emit(resultData);
    }
  }

  onLast() {
    this.currentPage = this.totalPages - 1;
    if (!this.isLastPage) {
      const resultData: any = {
        currentPage: this.currentPage,
        totalPages: this.totalPages,
        paginationPageSize: this.formSizePage.value.pageSize,
      };
      this.onBtLast.emit(resultData);
    }
  }

  onPageSizeSelectChanged() {
    this.currentPage = 0;
    const resultData: any = {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      paginationPageSize: this.formSizePage.value.pageSize,
    };
    this.onPageSizeChanged.emit(resultData);
  }
}
