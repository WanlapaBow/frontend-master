import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {ThaiDatePipe} from '../@theme/pipes/thaidate.pipe';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  thaiStringMediumDatetime(datetime: Date): string {
    return (
      new ThaiDatePipe().transform(datetime.toISOString(), 'medium') +
      ' ' +
      new DatePipe('en-EN').transform(datetime, 'HH:mm:ss')
    );
  }

  thaiStringMediumDate(datetime: Date): string {
    return new ThaiDatePipe().transform(datetime.toISOString(), 'medium');
  }

  dateFormat(datetime: Date): string {
    return new DatePipe('en-EN').transform(datetime, 'yyyy/MM/dd');
  }

  dateFormatddmmyyyy(datetime: Date): string {
    return new DatePipe('en-EN').transform(datetime, 'dd/MM/yyyy');
  }

  dateFormatmmddyyyy(datetime: Date): string {
    return new DatePipe('en-EN').transform(datetime, 'MM-dd-yyyy');
  }

  dateFormatUtc(date: string): string {
    return (moment(date).format('DD/MM/YYYY'));
  }

  dateFormatUtcTime(date: string): string {
    return (moment(date).format('DD/MM/YYYY HH:mm:ss'));
  }

  numberFormat(value): string {
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  downloadBlob(value: any, type: any, name: any) {
    let typeFile = null;
    switch (type) {
      case 'zip':
        typeFile = 'application/zip';
        break;
      default:
        typeFile = 'application/zip';
    }
    const blob = new Blob([value['body']], { type: typeFile });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.download = name + '.zip';
    anchor.href = url;
    anchor.click();
  }
}
