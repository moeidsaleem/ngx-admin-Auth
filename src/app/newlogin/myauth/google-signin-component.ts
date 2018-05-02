import {Component, ElementRef, AfterViewInit} from '@angular/core';
import { AwsService } from '../myauth/aws.service';
import { Callback } from '../myauth/aws.service';
import { GlobalService } from '../../globalService';
import { Router } from '@angular/router';


declare const gapi: any;

@Component({
  selector: 'google-signin',
  template: `<button class="radio-button" id="google" value="google" ><img src='assets/images/googleplussignin.png'></button>`
})
export class GoogleSigninComponent implements AfterViewInit {
  private clientId:string = '873878796815-mm6qi366rdhimkbm6a3e0npkehhqjljl.apps.googleusercontent.com';
  secret='zCwLFi1AviZ8bb9PILfr9sOF'
 // clientId:string = this.awsService.googleId;
  private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;

  public googleInit() {        
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        cookiepolicy: 'single_host_origin',
        scope: this.scope
      });
      this.attachSignin(this.element.nativeElement.firstChild);
    });
  }

  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        //console.log('Token || ' + googleUser.getAuthResponse().id_token);
        let authResponse = googleUser.getAuthResponse();
        console.log(authResponse);
        console.log("Authenticated to Google!")
    

        //console.log('ID: ' + JSON.stringify(profile));
        this.awsService.authenticateGoogle(authResponse,this.awsService.region,profile,this);
        this.awsService.authenticateGoogle(authResponse,this.awsService.region,profile,this);

        //final 
        this.api.loggedIn();
        let g = gapi.auth2.getAuthInstance();
        localStorage.setItem('token',g);
        console.log(authResponse);
        this.router.navigate(['pages/ui-features/buttons']).then(r=>{});
        

      }, function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  constructor(private element: ElementRef, public awsService:AwsService,private api:GlobalService,private router:Router) {
    //console.log('ElementRef: ', this.element);
  }

  ngAfterViewInit() {
    this.googleInit();
  }

  googleCallback(creds: any, profile: any) {
    this.awsService.setGoogleCreds(creds);
    this.awsService.setGoogleProfile(profile);
  }
}