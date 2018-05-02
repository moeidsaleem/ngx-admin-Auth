


import { Injectable, OnInit } from '@angular/core';
import {MENU_ITEMS } from './pages/pages-menu'
import { Router } from '@angular/router';


@Injectable()
export class GlobalService implements OnInit {

  ngOnInit(){
 

  }

  successMessage;


    isLoggedIn:boolean =false;

    loggedIn(){
        this.isLoggedIn =true;
        MENU_ITEMS.pop();
        if(MENU_ITEMS.length<=0){
          MENU_ITEMS.push({
            title:'LOGOUT',
            icon:'fa fa-exit',
            link:'/newlogin/signin',
          
        });

        }
     
     
          
          
    }

    logOut(){
        this.isLoggedIn =false;
        localStorage.removeItem('token');
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