import { NbMenuItem } from '@nebular/theme';
import { environment } from '../../environments/environment';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Statements',
    icon: 'list-outline',
    children: [
      {
        title: 'Create statements',
        link: 'statements/st001tx',
      },
      {
        title: 'Manage statements',
        link: 'statements/st002tx',
      },
      // {
      //   title: 'Print statements',
      //   link: 'statements/st003tx',
      // },
    ],
  },
  {
    title: 'Receipt',
    icon: 'list-outline',
    children: [
      {
        title: 'Create Receipt',
        link: 'statements/rc002tx/create',
      },
      {
        title: 'Advanced AR Receipt',
        link: 'statements/rc003tx',
      },
      {
        title: 'Manage Receipt',
        link: 'statements/rc002tx/management',
      },
      // {
      //   title: 'Create Receipt New',
      //   link: 'statements/rc006tx',
      // }, {
      //   title: 'Manage Receipt New',
      //   link: 'statements/rc005tx',
      // },
      {
        title: 'Advanced AP WHT',
        link: 'statements/rc007tx',
      },
    ],
  },
  {
    title: 'Matching',
    icon: 'list-outline',
    children: [
      {
        title: 'Matching Receipt',
        link: 'matching/mat001tx',
      },
    ],
  },
  {
    title: 'Interface',
    icon: 'sync-outline',
    children: [
      {
        title: 'AP WHT Interface',
        link: 'interface/in0643tx',
      },
      {
        title: 'AR Receipt Interface',
        link: 'interface/in003tx',
      },
      {
        title: 'GL Cancel Adv Receipt',
        link: 'interface/in0077tx',
      },
      {
        title: 'GL Cancel Adv Wht',
        link: 'interface/in0644tx',
      },
      // {
      //   title: 'Receipt Matching',
      //   link: 'statements/gl001tx',
      // },
    ],
  },
  {
    title: 'Report',
    icon: 'printer-outline',
    children: [
      // {
      //   title: 'Pending Refund Report',
      //   link: 'report/in069tx',
      // },
      {
        title: 'Pending Match Report',
        link: 'report/in035tx',
      },
      {
        title: 'Advance Receipt Report',
        link: 'report/in048tx',
      },
      {
        title: 'AR Statement Outstanding Report',
        link: 'report/in024tx',
      },
      {
        title: 'AR Statement Receipt Report',
        link: 'report/receiptReport',
      },
      {
        title: 'Statement Excel Report',
        link: 'report/statementExcelReport',
      },
      // {
      //   title: 'AR Statement Report For KBank',
      //   link: 'report/in081-2tx',
      // },
    ],
  },
  // {
  //   title: 'Others',
  //   icon: 'list-outline',
  //   children: [
  //     {
  //       title: 'Prop ID Editor',
  //       link: 'statements/in079tx',
  //     },
  //     // {
  //     //   title: 'Email Setup',
  //     //   link: 'statements/setupEmail',
  //     // },
  //   ],
  // },
    {
    title: 'ADMIN',
    group: true,
  },
  {
    title: 'Statements',
    icon: 'list-outline',
    children: [
      {
        title: 'Create statements',
        link: 'statements/st001tx-admin',
      },
      {
        title: 'Email Sender Config',
        link: 'statements/emailSender',
      },
    ],
  },
  {
    title: 'BACK',
    icon: 'undo-outline',
    url: environment.mainpage,
  },
  // {
  //   title: 'FEATURES',
  //   group: true,
  // },
  // {
  //   title: 'Auth',
  //   icon: 'lock-outline',
  //   children: [
  //     {
  //       title: 'Login',
  //       link: '/auth/login',
  //     },
  //     {
  //       title: 'Register',
  //       link: '/auth/register',
  //     },
  //     {
  //       title: 'Request Password',
  //       link: '/auth/request-password',
  //     },
  //     {
  //       title: 'Reset Password',
  //       link: '/auth/reset-password',
  //     },
  //   ],
  // },
];
