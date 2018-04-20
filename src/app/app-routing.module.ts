import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { MyauthComponent } from './newlogin/myauth/myauth.component'; 
import { NewloginComponent } from './newlogin/newlogin.component';
import { SignupComponent } from './newlogin/myauth/signup/signup.component';


const routes: Routes = [
  { path: 'pages', loadChildren: 'app/pages/pages.module#PagesModule' },
  {
    path: 'newlogin',
    component: NewloginComponent,
    children: [
     {
        path: '',
        redirectTo:'signin',
        pathMatch:'full'
       // component: MyauthComponent,
      },
      {
        path: 'signin',
        component: MyauthComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },

    ],
  },
  { path: 'signup', component: SignupComponent },
 { path: 'signin', component: MyauthComponent },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: true,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
