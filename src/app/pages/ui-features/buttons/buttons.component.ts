import { Component } from '@angular/core';
import { GlobalService } from '../../../globalService';

@Component({
  selector: 'ngx-buttons',
  styleUrls: ['./buttons.component.scss'],
  templateUrl: './buttons.component.html',
})
export class ButtonsComponent {

  constructor(private api:GlobalService){}
}
