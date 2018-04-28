import { Component, OnInit } from '@angular/core';
import { AwsService } from '../aws.service';
import { AccountService }  from '../../../pages/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../../globalService';




@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  username:string;
  password:string;
  email:string;
  fullname:string;
  emailErrMessage:string;
  usernameErrMessage:string;
  passwordErrMessage:string;
  errorMessage:string;
  successMessage:string;
  constructor(public awsService:AwsService,
    private router: Router,private accountService: AccountService, private api:GlobalService) { }


  ngOnInit() {


  }

  goSignIn(){
    this.router.navigate(['/newlogin/signin'])
  }

  onSignup(){
    this.awsService.addToUserPool(this,this.fullname,this.email,this.username,this.password,this.router,this.accountService, this.api)
   }



  clearErrors(){
    this.usernameErrMessage = "";
    this.passwordErrMessage = "";
    this.emailErrMessage = "";
  }

  goTo(link){
    this.router.navigate([link])
  }

}
