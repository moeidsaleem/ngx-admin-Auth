


import { Injectable } from '@angular/core';
import {MENU_ITEMS } from './pages/pages-menu'


@Injectable()
export class GlobalService {


  successMessage;


    isLoggedIn:boolean =false;

    loggedIn(){
        this.isLoggedIn =true;
        MENU_ITEMS.pop();
        MENU_ITEMS.push({
            title: 'Accounts',
            icon: 'fa fa-bank',
            link: '/pages/ui-features',
            children: [
              {
                title: 'Balance',
                link: '/pages/ui-features/tabs',
              },
              {
                title: 'Payments',
                link: '/pages/ui-features/grid',
              },
            ],
          },{
              title:'LOGOUT',
              icon:'fa fa-exit',
              link:'/newlogin/signin',
            
          })
     
          
          
    }

    logOut(){
        this.isLoggedIn =false;
        console.log('logged Out')
        MENU_ITEMS.pop();
        MENU_ITEMS.pop();
        MENU_ITEMS.push( {
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
          })
    }

}