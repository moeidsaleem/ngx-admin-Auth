import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { ButtonsModule } from './buttons/buttons.module';
import { UiFeaturesRoutingModule } from './ui-features-routing.module';
import { UiFeaturesComponent } from './ui-features.component';
import { GridComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { TabsComponent, Tab1Component, Tab2Component,Tab3Component } from './tabs/tabs.component';
import { SearchComponent } from './search-fields/search-fields.component';

const components = [
  UiFeaturesComponent,
  GridComponent,
  IconsComponent,
  TypographyComponent,
  TabsComponent,
  Tab1Component,
  Tab2Component,
  Tab3Component,
  SearchComponent,
];

@NgModule({
  imports: [
    ThemeModule,
    UiFeaturesRoutingModule,
    ButtonsModule,
  ],
  declarations: [
    ...components,
  ],
  entryComponents: [
   
  ],
})
export class UiFeaturesModule { }
