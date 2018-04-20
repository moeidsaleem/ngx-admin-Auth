import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  // {
  //   title: 'Accounts',
  //   icon: 'fa fa-bank',
  //   link: '/pages/ui-features',
  //   children: [
  //     {
  //       title: 'Balance',
  //       link: '/pages/ui-features/tabs',
  //     },
  //     {
  //       title: 'Payments',
  //       link: '/pages/ui-features/grid',
  //     },
  //   ],
  // },
  // {
  //   title: 'Analysis',
  //   icon: 'nb-bar-chart',
  //   children: [
  //     {
  //       title: 'Echarts',
  //       link: '/pages/charts/echarts',
  //     },
  //     {
  //       title: 'Charts.js',
  //       link: '/pages/charts/chartjs',
  //     },
  //     {
  //       title: 'D3',
  //       link: '/pages/charts/d3',
  //     },
  //   ],
  // },
  {
    title: 'Login',
    icon: 'nb-locked',
    children: [
      {
        title: 'Signin',
        link: '/newlogin/signin',
      },
      {
        title: 'Signup',
        link: '/newlogin/signup',
      },
    ],
  },
];
