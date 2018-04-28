import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
//import { MdInputModule, MdButtonModule, MdToolbarModule, MdCardModule, MdRadioModule, MdDialogModule, MdProgressSpinnerModule, MdChipsModule } from '@angular/material';
import { AwsService } from './aws.service';
import { MyauthComponent } from './myauth.component';
import { GoogleSigninComponent } from './google-signin-component';
//import { MyauthRoutingModule} from './myauth-routing.module'
import { NbCardHeaderComponent,NbCardBodyComponent,NbCardFooterComponent} from '@nebular/theme/components/card/card.component';
import { NbCardModule } from '@nebular/theme';
//import {OneColumnLayoutComponent} from '@nebular/theme/layouts/one'

import { ThemeModule } from '../../@theme/theme.module';
import { SignupComponent } from './signup/signup.component';

// Import the linkedin library
import { LinkedInSdkModule } from 'angular-linkedin-sdk';

//import the Facebook Library 
import { FacebookModule } from 'ngx-facebook';
import { CommonModule } from '@angular/common';


 


const MYAUTH_COMPONENT = [
  MyauthComponent,
];

@NgModule({
  declarations: [
    GoogleSigninComponent,
    ...MYAUTH_COMPONENT,
    SignupComponent,

  ],
  imports: [
    FormsModule,
    HttpModule,
    CommonModule,
   // MyauthRoutingModule,
    NbCardModule,
    LinkedInSdkModule,
    FacebookModule.forRoot()
    //MdInputModule,MdButtonModule, MdToolbarModule, MdCardModule, MdRadioModule, MdDialogModule, MdProgressSpinnerModule, MdChipsModule
  ],
  providers: [
    AwsService,
     // Inject apiKey and, optionally, authorize to integrate with LinkedIN official API
     { provide: 'apiKey', useValue: '813slcq4efpaqe' },
     { provide: 'authorize', useValue: 'true' }, // OPTIONAL by default: false
     { provide: 'isServer', useValue: 'true' }  // OPTIONAL by default: false
   
  ],
})
export class MyauthModule { }
