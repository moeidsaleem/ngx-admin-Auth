import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UiFeaturesComponent } from './ui-features.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { GridComponent } from './grid/grid.component';
import { IconsComponent } from './icons/icons.component';
import { TypographyComponent } from './typography/typography.component';
import { TabsComponent, Tab1Component, Tab2Component ,Tab3Component} from './tabs/tabs.component';
import { SearchComponent } from './search-fields/search-fields.component';

const routes: Routes = [{
  path: '',
  component: UiFeaturesComponent,
  children: [{
    path:'',
    redirectTo:'buttons',
    pathMatch:'full'
  },{
    path: 'buttons',
    component: ButtonsComponent,
  }, {
    path: 'grid',
    component: GridComponent,
  }, {
    path: 'icons',
    component: IconsComponent,
  }, {
    path: 'typography',
    component: TypographyComponent,
  }, {
    path: 'search-fields',
    component: SearchComponent,
  }, {
    path: 'tabs',
    component: TabsComponent,
    children: [{
      path: '',
      redirectTo: 'tab1',
      pathMatch: 'full',
    }, {
      path: 'tab1',
      component: Tab1Component,
    }, {
      path: 'tab2',
      component: Tab2Component,
    },{
      path: 'tab3',
      component: Tab3Component,
    }],
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UiFeaturesRoutingModule { }
