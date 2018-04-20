import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewloginComponent} from './newlogin.component';
import { MyauthComponent } from './myauth/myauth.component';
import { SignupComponent } from './myauth/signup/signup.component';


const routes: Routes = [{
  path: '',
  component: NewloginComponent,
  children: [{
    path: 'signin',
    component: MyauthComponent,
  }, {
    path: 'signup',
    component: SignupComponent,
  }, {
    path: '',
    redirectTo: 'signin',
    pathMatch: 'full',
  }],
}];




@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewloginRoutingModule { }