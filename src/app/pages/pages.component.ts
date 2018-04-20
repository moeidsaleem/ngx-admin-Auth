import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu'; 
import { AccountService } from './account.service';



@Component({
  selector: 'ngx-pages',
  template: `
    <ngx-sample-layout>
    
      <nb-menu [items]="menu" ></nb-menu>
      <router-outlet ></router-outlet>
    </ngx-sample-layout>
  
  `,
})
export class PagesComponent {

  constructor(private account:AccountService){

  }

  x=false;

  menu = MENU_ITEMS;
  

 
}
