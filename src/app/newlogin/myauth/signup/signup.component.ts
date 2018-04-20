import { Component, OnInit } from '@angular/core';
import { AwsService } from '../aws.service';
import { AccountService }  from '../../../pages/account.service';
import { Router, ActivatedRoute } from '@angular/router';




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
  constructor(public awsService:AwsService,
    private router: Router,private accountService: AccountService) { }

  ngOnInit() {
  }

  onSignup(){
    this.awsService.addToUserPool(this,this.fullname,this.email,this.username,this.password,this.router,this.accountService);  
  }
  clearErrors(){
    this.usernameErrMessage = "";
    this.passwordErrMessage = "";
    this.emailErrMessage = "";
  }

}
