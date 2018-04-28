import { Injectable } from '@angular/core';
import {Http, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { AccountService } from '../../pages/account.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as AWS from 'aws-sdk';
import { GlobalService } from '../../globalService';
//import * as AWSCognito from 'amazon-cognito-identity-js';

//declare let AWS: any;
declare let AWSCognito: any;
declare let apigClientFactory: any;

export interface Callback {
  cognitoCallback(message: string, result: any):void;
  cognitoCallbackWithCreds(message: string, result: any, creds: any, data:any):void;
  googleCallback(creds: any, profile: any);
  googleCallbackWithData(data: any);
  testCallback(result:any, err:any);
}

@Injectable()
export class AwsService {
  token:any;
  googleCreds:any;
  googleProfile:any;
  googleData:any;
  userData:any;

 /************ RESOURCE IDENTIFIERS *************/

  googleId:string = '873878796815-mm6qi366rdhimkbm6a3e0npkehhqjljl.apps.googleusercontent.com'
  poolData = { 
        UserPoolId : 'us-east-2_NPxxzC6O4', //CognitoUserPool
        ClientId : '2ifc0t63fe4qer131f4gvj57mo', //CognitoUserPoolClient 
        Paranoia : 7
    };
  identityPool:string = 'us-east-2:fe4ac688-20ac-4d6f-af58-886072878da5'; //CognitoIdentityPool 
  apiURL:string = 'https://vfazvxaqub.execute-api.us-east-2.amazonaws.com/demo';  //ApiUrl
  region:string = 'us-east-2'; //Region Matching CognitoUserPool region

 /*********************************************/

 signupConfirmMessage:any;
  constructor(private _http:Http,private api:GlobalService) {
   
    AWS.config.update({
      region: this.region,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: ''
      })
    });
    AWSCognito.config.region = this.region;
    //AWSCognito.config.update({accessKeyId: 'null', secretAccessKey: 'null'});
    AWSCognito.config.update({accessKeyId: 'AKIAJLXTQQUFZ6QXWAAQ', secretAccessKey: ' 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'});
   }

  setGoogleCreds(googleCreds){
    this.googleCreds=googleCreds;
  }

  getgoogleCreds(callback){
    callback.googleCallback(this.googleCreds);
    return this.googleCreds;
  }

  setGoogleProfile(googleProfile){
    this.googleProfile=googleProfile;
  }

  getgoogleProfile(callback){
    callback.googleCallback(this.googleProfile);
    return this.googleProfile;
  }

  getgoogleData(callback){
    callback.googleCallback(this.googleCreds,this.getgoogleProfile);
    let googleData = {
        awsCreds : this.googleCreds,
        googleProfile : this.getgoogleProfile
      };
    return googleData;
  }
  

  authenticateGoogle(authResult,region,profile,callback){
    // Add the Google access token to the Cognito credentials login map.
     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.identityPool,
        Logins: {
           'accounts.google.com': authResult['id_token']
        }
     });

     // Obtain AWS credentials
     AWS.config.getCredentials(function(){
        // Access AWS resources here.
        let creds = {
          accessKey: AWS.config.credentials.accessKeyId,
          secretKey: AWS.config.credentials.secretAccessKey,
          sessionToken: AWS.config.credentials.sessionToken
        };
        let googleData = {
          awsCreds : creds,
          googleProfile : profile
        };
        callback.googleCallback(creds,profile);
      });

  }

  userInfoApiGoogle(accessKey,secretKey,sessionToken,name,surname,email,region,callback){
    let body = {
      name : name,
      surname : surname,
      email: email
    };

    let userData;

    let apigClient = apigClientFactory.newClient({
        accessKey: accessKey,
        secretKey: secretKey,
        sessionToken: sessionToken,
        region: region // The region where the API is deployed
    });
    apigClient.googlePost({},body,{})
      .then(function(response) {
        console.log("Send user data to API");
      }).catch(function (response) {
        console.log(response);
    });
    apigClient.googleGet({},{})
      .then(function(response) {
        console.log("Retrieve data from API");
        userData = response.data.Items[0];
        callback.googleCallbackWithData(userData);
      }).catch(function (response) {
        console.log(response);
      });
  }
  

  atrixData;
  addToUserPool(callback,fullName,email,username,password,router,accountService,api){
    let authenticationData = {
      Username : username,
      Password : password,
      };
      var dataEmail = {
        Name : 'email',
        Value : email
      };
      var dataFullName = {
        Name : 'full_name',
        Value : fullName
      };

      let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
      let attributeList = [];
      let attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
     // let attributeFullName = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataFullName);
      
      attributeList.push(attributeEmail);
     // attributeList.push(attributeFullName);
      return userPool.signUp(username, password, attributeList, null, function(err, result){
        if (err) {
            //alert(err);
            if (err.message.indexOf("User") !== -1){
              callback.usernameErrMessage = err.message;
            }else if (err.message.indexOf("email") !== -1){
              callback.emailErrMessage =err.message;
            }
            else{
              callback.passwordErrMessage =err.message;
            }
            callback.errorMessage = err.message;
            return;
        }
        let cognitoUser = result.user;
        console.log('user name is ' + cognitoUser.getUsername());
        accountService.currentCfoId = cognitoUser.getUsername();
        api.successMessage ='Please Verify Your email Address...';
        accountService.isAuthenticated =true;
       router.navigate(['/newlogin/signin'])
      // api.loggedIn();
        
    });

    
  }


  messagex;
  authenticateUserPool(user,password,callback,router,accountService,api){
    let authenticationData = {
      Username : user,
      Password : password,
      };
    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
    let userData = {
        Username : user,
        Pool : userPool
    };
    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        let cognitoGetUser = userPool.getCurrentUser();
        callback.cognitoCallback(null, result);
        if (cognitoGetUser != null) {
          cognitoGetUser.getSession(function(err, result) {

            if (result) {
              console.log ("Authenticated to Cognito User Pools!");  
              accountService.currentCfoId = cognitoGetUser.getUsername();
              //got message 
              console.log('got message running it');
              callback.successMessage = 'User Created. Please verify your email address.';
              accountService.currentCfoSub = cognitoGetUser.signInUserSession.idToken.payload.sub;
              api.loggedIn();
              router.navigate(['pages/ui-features/buttons'])
            }
          
          });
        }
      },
      onFailure: function(err) {
        if (err) {
          //alert(err);
          if (err.message.indexOf("User") !== -1){
            callback.usernameErrMessage = err.message;
          }else{
            callback.passwordErrMessage =err.message;
          }
          
          callback.errorMessage = err.message;
          //callback.cognitoCallback(err, null);
          return;
        }
         
      }
    });
  }

  getInfoApiUserPools(token):Observable<any>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this._http.get(this.apiURL+"/cup", {headers: headers})
        .map(res => res.json().Items[0])
        .catch(this._serverError);

  }

  postInfoApiUserPools(token):Observable<any>{
    let headers = new Headers();
    let body = {};
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', token);
    return this._http.post(this.apiURL+"/cup",JSON.stringify(body), {headers: headers})
            .map(res => res.json())
            .catch(this._serverError);
  }

  authenticateIdentityPool(user,password,region,callback){
    let authenticationData = {
      Username : user,
      Password : password,
      };
    let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
    let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(this.poolData);
    let userData = {
        Username : user,
        Pool : userPool
    };
    let cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    let cognitoParams = {
      IdentityPoolId: this.identityPool,
      Logins: {}
    };
    let poolId = this.poolData.UserPoolId;
    
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        let cognitoGetUser = userPool.getCurrentUser();
        if (cognitoGetUser != null) {
          cognitoGetUser.getSession(function(err, result) {
            if (result) {
              console.log ("Authenticated to Cognito User and Identity Pools!");  
              // this.api.loggedIn();
              // this.router.navigateByUrl('app/pages/ui-features/buttons');  
              let token = result.getIdToken().getJwtToken();
              cognitoParams.Logins["cognito-idp."+region+".amazonaws.com/"+poolId] = token;
              AWS.config.credentials = new AWS.CognitoIdentityCredentials(cognitoParams);
        
              // Obtain AWS credentials
              AWS.config.getCredentials(function(){
                  // Access AWS resources here.
                  let creds = {
                    accessKey: AWS.config.credentials.accessKeyId,
                    secretKey: AWS.config.credentials.secretAccessKey,
                    sessionToken: AWS.config.credentials.sessionToken
                  };
                  let additionalParams = {
                    headers: {
                      Authorization: token
                    }
                  };
                  let params = {};
                  let body = {};
                  let apigClient = apigClientFactory.newClient({
                      accessKey: AWS.config.credentials.accessKeyId,
                      secretKey: AWS.config.credentials.secretAccessKey,
                      sessionToken: AWS.config.credentials.sessionToken,
                      region: region // The region where the API is deployed
                  });
                  let apigClientJWT = apigClientFactory.newClient();
                  apigClientJWT.cipInfoGet({},{},additionalParams)
                    .then(function(response) {
                      body = response.data.Item;
                      console.log("Retrieving User Attributes from User Pool");
                      if (body != null){
                        apigClient.cipPost({},body,{})
                          .then(function(response) {
                            console.log("Send user data to API");
                          }).catch(function (response) {
                            console.log(response);
                        });
                      }
                    }).catch(function (response) {
                      console.log(response);
                    });

                  apigClient.cipGet(params,{})
                    .then(function(response) {
                      console.log("Retrieve data from API");
                      let data = response.data.Items[0];
                      callback.cognitoCallbackWithCreds(null, result, creds, data);
                    }).catch(function (response) {
                      console.log(response);
                    });
                  });             
            }
          });
        }
      },
      onFailure: function(err) {
          callback.cognitoCallback(err, null);
      }
    });

  }

  testAccess(data,provider,region,callback){
    let apigClient = apigClientFactory.newClient({
        accessKey: data.accessKey,
        secretKey: data.secretKey,
        sessionToken: data.sessionToken,
        region: region // The region where the API is deployed
    });
  
    if (provider=="google"){
      apigClient.googleGet({},{})
      .then(function(response) {
        console.log(response);
        console.log("Access to /google API Resource with current credentials GRANTED");
        callback.testCallback(response,null);
      }).catch(function (response) {
        console.log(response);
        console.log("Access to /google API Resource with current credentials DENIED");
        callback.testCallback(null,response);
      });
    }
    
    if (provider=="cup"){
      let apigClient = apigClientFactory.newClient();
      let additionalParams = {
        headers: {
          Authorization: data.token
        }
      };
      apigClient.cupGet({},{})
        .then(function(response) {
          console.log(response);
          console.log("Access to /cup API Resource with current credentials GRANTED");
          callback.testCallback(response,null);
        }).catch(function (response) {
          console.log(response);
          console.log("Access to /cup API Resource with current credentials DENIED");
          callback.testCallback(null,response);
        });
    }

    if (provider=="cip"){
      apigClient.cipGet({},{})
        .then(function(response) {
          console.log(response);
          console.log("Access to /cip API Resource with current credentials GRANTED");
          callback.testCallback(response,null);
        }).catch(function (response) {
          console.log(response);
          console.log("Access to /cip API Resource with current credentials DENIED");
          callback.testCallback(null,response);
        });
    }
  }

  private _serverError(err: any) {
        console.log('sever error:', JSON.stringify(err));  // debug
        if(err.status === 0){
            return Observable.throw(err.json().error || 'UNAUTHORIZED!!!');
        }
        if(err instanceof Response) {
          return Observable.throw(err.json().error || 'Backend Server Error');
        }
        // return Observable.throw(err || 'Backend Server Error');
    }

}
