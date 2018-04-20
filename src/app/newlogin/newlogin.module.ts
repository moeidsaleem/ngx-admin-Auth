import { NgModule } from '@angular/core';

import { NewloginRoutingModule } from './newlogin-routing.module';
import { NewloginComponent } from './newlogin.component';
import { MyauthModule } from  './myauth/myauth.module';
import { ThemeModule } from '../@theme/theme.module';
import { NbCardModule } from '@nebular/theme';
import { NbCardHeaderComponent,NbCardBodyComponent,NbCardFooterComponent} from '@nebular/theme/components/card/card.component';
//import { AwsService } from './myauth/aws.service';




const components = [
    NewloginComponent,
];

@NgModule({
  imports: [
    NewloginRoutingModule,
    MyauthModule,
    ThemeModule,
    NbCardModule,
  ],
  declarations: [
    ...components,
  ],
  bootstrap: [NewloginComponent],
})
export class NewloginModule { }