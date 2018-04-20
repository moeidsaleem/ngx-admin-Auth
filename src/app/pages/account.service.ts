import { Injectable } from '@angular/core';
import { Account } from './account';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountService {
  private accountsUrl = 'http://cfo-env.us-east-2.elasticbeanstalk.com/api';
  balanceAccounts: Account[] = [];
  currentCfoId:string = '';
  currentCfoSub:string = '';
  isLoggedIn:boolean = false;
  
  

  constructor (private http: Http) {}

  // get("/api/overallbalance")
   getbalance(){
    console.log("overallbalance");
      return this.http.get(this.accountsUrl+"/overallbalance?bank=Nordea&cfoid=cfo1");
      //.subscribe(response => response.json() as Account[]);
  }

  // get("/api/overallbalance")
    getOverallbalance(): Promise<void | Account[]> {
    console.log("overallbalance");
    console.log("this.currentCfoSub: " +this.currentCfoSub);
    console.log("this.currentCfoId: " +this.currentCfoId);
    return this.http.get(this.accountsUrl+"/overallbalance?currentCfoSub="+this.currentCfoSub+"&cfoid="+this.currentCfoId)
               .toPromise()
               .then((response:Response) =>{
                 this.balanceAccounts = response.json() as Account[]
                return this.balanceAccounts
                })
               .catch(this.handleError);
  }
  
  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
  }
  
}