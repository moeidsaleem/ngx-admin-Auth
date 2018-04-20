import { Component } from '@angular/core';
import { Account } from '../../account';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../account.service';
import { AwsService } from '../../../newlogin/myauth/aws.service';


@Component({
  selector: 'ngx-tab1',
  template: `
  <div class="row">
  <div class="col-md-12">
    <nb-card>
      <nb-card-header>
        <div class="row">
          <div  ngbRadioGroup
               class="btn-group btn-divided-group btn-outline-divided-group btn-group-full-width col-md-8">
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="checkingFilter()">
              <input ngbButton type="radio" value="left"> Checking
            </label>
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="shortTermFilter()">
              <input ngbButton type="radio" value="middle"> Short Term
            </label>
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="longTermFilter()">
              <input ngbButton type="radio" value="right"> Long Term
            </label>
          </div>
        </div>
      </nb-card-header>
      <nb-card-body>
      <div  *ngFor="let account of selectedAccounts">
        <div class="col-md-12">
          <nb-card> 
            <nb-card-header>
            <div>
            <h6 ><b>Account&nbsp;:</b>  &nbsp; {{account.account_no}} <img src={{account.bank_img}} style="width:50px;" align="right"/></h6>       
           </div>
            </nb-card-header>
            <nb-card-body>
            <div>
              <h6 ><b>Balance&nbsp;:</b>&nbsp; {{account.amount}}  &nbsp;&nbsp; {{account.currency}}
              <button class="btn btn-primary btn-tn" style="float: right;" >Move Funds</button>&nbsp;&nbsp;
              </h6>  
              </div>            
            </nb-card-body>
          </nb-card>
        </div>
        </div>
      </nb-card-body>
    </nb-card>
  </div>
</div>
  `,
  //providers: [AccountService]
})
export class Tab1Component {
  accounts: Account[] = [];
  selectedAccounts :Account[]   = [];
  account1: Account = new Account();
  account2: Account = new Account();
  account3: Account = new Account();
  account4: Account = new Account();
  account5: Account = new Account();
  account6: Account = new Account();
  account7: Account = new Account();
  account8: Account = new Account();
  
  constructor(private accountService: AccountService,public awsService:AwsService) {

    if (!accountService.isLoggedIn){
      return;
    }
    
    this.accountService
    .getOverallbalance()
    .then((accounts: Account[]) => {
      this.accounts = this.accounts.concat(accounts.map((account) => {
        if (!account.account_no) {
          account.account_no = 'no number';
        }
        return account;
      }));
    });
    this.account1.account_no = '111111';
    this.account1.amount = '1000';
    this.account1.currency = 'USD';
    this.account1.bank = 'Nordea';
    this.account1.type = 'Checking';
    this.account1.bank_img = 'assets/images/nordea.png';

    this.account2.account_no = '2222222';
    this.account2.amount = '2000';
    this.account2.currency = 'GBP';
    this.account2.bank = 'Nordea';
    this.account2.type = 'Short Term';
    this.account2.bank_img = 'assets/images/nordea.png'


    this.account3.account_no = '33333333';
    this.account3.amount = '3000';
    this.account3.currency = 'USD';
    this.account3.bank = 'Nordea';
    this.account3.type = 'Checking';
    this.account3.bank_img = 'assets/images/nordea.png'


    this.account4.account_no = '4444444444';
    this.account4.amount = '4000';
    this.account4.currency = 'GBP';
    this.account4.bank = 'RBS';
    this.account4.type = 'Long Term';
    this.account4.bank_img = 'assets/images/rbs_round.png'


    this.account5.account_no = '55555555';
    this.account5.amount = '5000';
    this.account5.currency = 'EUR';
    this.account5.bank = 'RBS';
    this.account5.type = 'Checking';
    this.account5.bank_img = 'assets/images/rbs_round.png'


    this.account6.account_no = '66666666';
    this.account6.amount = '6000';
    this.account6.currency = 'EUR';
    this.account6.bank = 'RBS';
    this.account6.type = 'Short Term';
    this.account6.bank_img = 'assets/images/rbs_round.png'


    this.account7.account_no = '777777777';
    this.account7.amount = '7000';
    this.account7.currency = 'GBP';
    this.account7.bank = 'Starling';
    this.account7.type = 'Long Term';
    this.account7.bank_img = 'assets/images/starling_round.png'


    this.account8.account_no = '888888888';
    this.account8.amount = '8000';
    this.account8.currency = 'USD';
    this.account8.bank = 'Starling';
    this.account8.type = 'Checking';
    this.account8.bank_img = 'assets/images/starling_round.png'


    this.accounts.push(this.account1);
    this.accounts.push(this.account2);
    this.accounts.push(this.account3);
    this.accounts.push(this.account4);
    this.accounts.push(this.account5);
    this.accounts.push(this.account6);
    this.accounts.push(this.account7);
    this.accounts.push(this.account8);

    this.checkingFilter();
  }

  checkingFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].type.trim().toUpperCase()== 'Checking'.toUpperCase()){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }

  shortTermFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].type.trim().toUpperCase() == 'Short Term'.toUpperCase()){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }

  longTermFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].type.trim().toUpperCase() == 'Long Term'.toUpperCase()){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }
 }

@Component({
  selector: 'ngx-tab2',
  template: `
  <div class="row">
  <div class="col-md-12">
    <nb-card>
      <nb-card-header>
        <div class="row">
          <div ngbRadioGroup
               class="btn-group btn-divided-group btn-outline-divided-group btn-group-full-width col-md-8">
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="usdFilter()">
              <input ngbButton type="radio" value="left"> USD
            </label>
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="gbpFilter()">
              <input ngbButton type="radio" value="middle"> GBP
            </label>
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="eurFilter()">
              <input ngbButton type="radio" value="right"> EUR
            </label>
          </div>
        </div>
      </nb-card-header>
      <nb-card-body>
      <div  *ngFor="let account of selectedAccounts">
        <div class="col-md-12">
        <nb-card> 
        <nb-card-header>
        <div>
        <h6 ><b>Account&nbsp;:</b>  &nbsp; {{account.account_no}} &nbsp; - &nbsp; {{account.type}} <img src={{account.bank_img}} style="margin:auto; width:50px;" align="right"/></h6>       
       </div>
        </nb-card-header>
        <nb-card-body>
        <div>
          <h6 ><b>Balance&nbsp;:</b>&nbsp; {{account.amount}}
          <button class="btn btn-primary btn-tn" style="float: right;" >Move Funds</button>&nbsp;&nbsp;
          </h6>  
          </div>            
        </nb-card-body>
      </nb-card>
        </div>
        </div>
      </nb-card-body>
    </nb-card>
  </div>
</div>
  `,
  //providers: [AccountService]
})
export class Tab2Component { 

  accounts: Account[] = [];
  selectedAccounts :Account[]   = [];
  account1: Account = new Account();
  account2: Account = new Account();
  account3: Account = new Account();
  account4: Account = new Account();
  account5: Account = new Account();
  account6: Account = new Account();
  account7: Account = new Account();
  account8: Account = new Account();

  constructor(private accountService: AccountService) {
    
    if (!accountService.isLoggedIn){
      return;
    }

    this.accountService
    .getOverallbalance()
    .then((accounts: Account[]) => {
      this.accounts = this.accounts.concat(accounts.map((account) => {
        if (!account.account_no) {
          account.account_no = 'no number';
        }
        return account;
      }));
    });
    this.account1.account_no = '111111';
    this.account1.amount = '1000';
    this.account1.currency = 'USD'
    this.account1.bank = 'Nordea'
    this.account1.type = 'Checking'
    this.account1.bank_img = 'assets/images/nordea.png'

    this.account2.account_no = '2222222';
    this.account2.amount = '2000';
    this.account2.currency = 'GBP'
    this.account2.bank = 'Nordea'
    this.account2.type = 'Short Term'
    this.account2.bank_img = 'assets/images/nordea.png'

    this.account3.account_no = '33333333';
    this.account3.amount = '3000';
    this.account3.currency = 'USD'
    this.account3.bank = 'Nordea'
    this.account3.type = 'Checking'
    this.account3.bank_img = 'assets/images/nordea.png'

    this.account4.account_no = '4444444444';
    this.account4.amount = '4000';
    this.account4.currency = 'GBP'
    this.account4.bank = 'RBS'
    this.account4.type = 'Long Term'
    this.account4.bank_img = 'assets/images/rbs_round.png'

    this.account5.account_no = '55555555';
    this.account5.amount = '5000';
    this.account5.currency = 'EUR'
    this.account5.bank = 'RBS'
    this.account5.type = 'Checking'
    this.account5.bank_img = 'assets/images/rbs_round.png'

    this.account6.account_no = '66666666';
    this.account6.amount = '6000';
    this.account6.currency = 'EUR'
    this.account6.bank = 'RBS'
    this.account6.type = 'Short Term'
    this.account6.bank_img = 'assets/images/rbs_round.png'

    this.account7.account_no = '777777777';
    this.account7.amount = '7000';
    this.account7.currency = 'GBP'
    this.account7.bank = 'Starling'
    this.account7.type = 'Long Term'
    this.account7.bank_img = 'assets/images/starling_round.png'

    this.account8.account_no = '888888888';
    this.account8.amount = '8000';
    this.account8.currency = 'USD'
    this.account8.bank = 'Starling'
    this.account8.type = 'Checking'
    this.account8.bank_img = 'assets/images/starling_round.png'

    this.accounts.push(this.account1);
    this.accounts.push(this.account2);
    this.accounts.push(this.account3);
    this.accounts.push(this.account4);
    this.accounts.push(this.account5);
    this.accounts.push(this.account6);
    this.accounts.push(this.account7);
    this.accounts.push(this.account8);
    this.usdFilter();
  }

  usdFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].currency == 'USD'){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }

  gbpFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].currency == 'GBP'){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }

  eurFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].currency == 'EUR'){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }
}


@Component({
  selector: 'ngx-tab3',
  template: `
  <div class="row">
  <div class="col-md-12">
    <nb-card>
      <nb-card-header>
        <div class="row">
          <div ngbRadioGroup
               class="btn-group btn-divided-group btn-outline-divided-group btn-group-full-width col-md-8">
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="nordeaFilter()">
              <input ngbButton type="radio" value="left"> Nordea
            </label>
            <label ngbButtonLabel  class="btn btn-outline-primary btn-sm" (click)="rbsFilter()">
              <input ngbButton type="radio" value="middle"> RBS
            </label>
            <label ngbButtonLabel   class="btn btn-outline-primary btn-sm" (click)="starlingFilter()">
              <input ngbButton type="radio" value="right"> Starling
            </label>
          </div>
        </div>
      </nb-card-header>
      <nb-card-body>
      <div  *ngFor="let account of selectedAccounts">
        <div class="col-md-12">
          <nb-card> 
            <nb-card-header>
            <div>
            <h6 ><b>Account&nbsp;:</b>  &nbsp; {{account.account_no}} &nbsp; - &nbsp; {{account.type}} <img src={{account.bank_img}} style="margin:auto; width:50px;" align="right"/></h6>       
           </div>
            </nb-card-header>
            <nb-card-body>
            <div>
              <h6 ><b>Balance&nbsp;:</b>&nbsp; {{account.amount}}  &nbsp;&nbsp; {{account.currency}}
              <button class="btn btn-primary btn-tn" style="float: right;" >Move Funds</button>&nbsp;&nbsp;
              </h6>  
              </div>            
            </nb-card-body>
          </nb-card>
        </div>
        </div>
      </nb-card-body>
    </nb-card>
  </div>
</div> 
`,
//providers: [AccountService]
})
export class Tab3Component {
  accounts: Account[] = [];
  selectedAccounts :Account[]   = [];
  account1: Account = new Account();
  account2: Account = new Account();
  account3: Account = new Account();
  account4: Account = new Account();
  account5: Account = new Account();
  account6: Account = new Account();
  account7: Account = new Account();
  account8: Account = new Account();

  constructor(private accountService: AccountService) {

    if (!accountService.isLoggedIn){
      return;
    }
    
    this.accountService
    .getOverallbalance()
    .then((accounts: Account[]) => {
      this.accounts = this.accounts.concat(accounts.map((account) => {
        if (!account.account_no) {
          account.account_no = 'no number';
        }
        return account;
      }));
    });
    this.account1.account_no = '111111';
    this.account1.amount = '1000';
    this.account1.currency = 'USD'
    this.account1.bank = 'Nordea'
    this.account1.type = 'Checking'
    this.account1.bank_img = 'assets/images/nordea.png'

    this.account2.account_no = '2222222';
    this.account2.amount = '2000';
    this.account2.currency = 'GBP'
    this.account2.bank = 'Nordea'
    this.account2.type = 'Short Term'
    this.account2.bank_img = 'assets/images/nordea.png'

    this.account3.account_no = '33333333';
    this.account3.amount = '3000';
    this.account3.currency = 'USD'
    this.account3.bank = 'Nordea'
    this.account3.type = 'Checking'
    this.account3.bank_img = 'assets/images/nordea.png'

    this.account4.account_no = '4444444444';
    this.account4.amount = '4000';
    this.account4.currency = 'GBP'
    this.account4.bank = 'RBS'
    this.account4.type = 'Long Term'
    this.account4.bank_img = 'assets/images/rbs_round.png'

    this.account5.account_no = '55555555';
    this.account5.amount = '5000';
    this.account5.currency = 'EUR'
    this.account5.bank = 'RBS'
    this.account5.type = 'Checking'
    this.account5.bank_img = 'assets/images/rbs_round.png'

    this.account6.account_no = '66666666';
    this.account6.amount = '6000';
    this.account6.currency = 'EUR'
    this.account6.bank = 'RBS'
    this.account6.type = 'Short Term'
    this.account6.bank_img = 'assets/images/rbs_round.png'

    this.account7.account_no = '777777777';
    this.account7.amount = '7000';
    this.account7.currency = 'GBP'
    this.account7.bank = 'Starling'
    this.account7.type = 'Long Term'
    this.account7.bank_img = 'assets/images/starling_round.png'

    this.account8.account_no = '888888888';
    this.account8.amount = '8000';
    this.account8.currency = 'USD'
    this.account8.bank = 'Starling'
    this.account8.type = 'Checking'
    this.account8.bank_img = 'assets/images/starling_round.png'

    this.accounts.push(this.account1);
    this.accounts.push(this.account2);
    this.accounts.push(this.account3);
    this.accounts.push(this.account4);
    this.accounts.push(this.account5);
    this.accounts.push(this.account6);
    this.accounts.push(this.account7);
    this.accounts.push(this.account8);
    this.nordeaFilter();
  }

  nordeaFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].bank == 'Nordea'){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }

  rbsFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].bank == 'RBS'){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }

  starlingFilter(){
    this.selectedAccounts = [];
    for(var i =0; i< this.accounts.length; i++){
      if(this.accounts[i].bank == 'Starling'){
          this.selectedAccounts.push(this.accounts[i]);
      }
    }
  }
 }


@Component({
  selector: 'ngx-tabs',
  styleUrls: ['./tabs.component.scss'],
  templateUrl: './tabs.component.html',
})
export class TabsComponent {

  tabs: any[] = [
    {
      title: 'Accoxunts',
      route: '/pages/ui-features/tabs/tab1',
    },
    {
      title: 'Currencies',
      route: '/pages/ui-features/tabs/tab2',
    },
    {
      title: 'Banks',
      route: '/pages/ui-features/tabs/tab3',
    }
  ];
  
  

}
