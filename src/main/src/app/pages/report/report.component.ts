import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-report',
  template: ` <router-outlet></router-outlet> `,
})
export class ReportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
