var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var ACCOUNTS_COLLECTION = "accounts";
var CFO_ACCESS_INFO_COLLECTION = "cfoAccessInfo";
var CLIENT_INFO_COLLECTION = "clientInfo";

var app = express();
app.use(bodyParser.json());

// banks api 
//const myNordea = require('./nordea');
var nordeaAccounts =  [];
var balNordea = [];

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
var clientInfoDictionary = {};

// Connect to the database before starting the application server.
mongodb.MongoClient.connect('mongodb://localhost:27017/MyDb', function (err, database) {
    console.log("Trying to connect mongodb server");
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

//// on startup , cache all client info into dictionary clientInfoDictionary
// retrieve information from db collection clientInfo
 db.collection(CLIENT_INFO_COLLECTION).find({}).toArray(function(err, docs) {
  if (err) {
    handleError(res, err.message, "Failed to get contacts.");
  } else { 
    for (var i =0 ; i < docs.length; i++){
        clientInfoDictionary[docs[i].bank_name] = docs[i];
    }
    console.log("clientInfoDictionary = ");
    Object.keys(clientInfoDictionary).forEach(function(key) {
        var val = clientInfoDictionary[key];
        console.log(val);
    });

  }

});


  // Initialize the app.
  var server = app.listen('http://cfo-env.us-east-2.elasticbeanstalk.com', function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});




// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
  // CORS on ExpressJS - overcome error on chrome for both clent and server in localhost
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  /*  "/api/contacts"
   *    GET: finds all contacts
   *    POST: creates a new contact
   */

      // call bank api to get balance
console.log ("getting Nordea balance");
  app.use("/api/accounts/load", function (req, res) {
    /****  get exchnage rate for account *****/
    const myNordea = require('./nordea');
    myNordea.getNordeaBalance(function (err, data) {
        if (err) return console.error(err);
        console.log(data.toString());
        var account = data.response.accounts[0].account.identification.iban;
        var currency = data.response.accounts[0].account.currency;
        var amount = data.response.accounts[0].balances[0].amount;
    
    
        var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":"Nordea"}
    
        console.log(newAccount);
     });
   

 


    db.collection(ACCOUNTS_COLLECTION).insertOne(newAccount, function(err, doc) {
        if (err) {
          handleError(res, err.message, "Failed to create new account.");
        } else {
          res.status(201).json(doc.ops[0]);
        }
      });  

    //res.status(200).json(balNordea);
});

  //  console.log("in server.js");
  //  console.log(balNordea);

  app.get("/api/auth",function(req,res) {
        var url = 'https://api.nordeaopenbanking.com/v1/authentication?client_id=a9dbb627-c34e-4523-b51e-2256739182b2&state=102092&redirect_uri=https://www.etaureum.com/';
      //  res.redirect(301,url);
      //  console.log(res.json);     
        console.log("API AUTH");
        var request = require('request');
        var r = request.get(url, function (err, res, body) {
            console.log("API AUTH2");
            console.log(r.uri.href);
          //  console.log(res.request.uri.href);

            // Mikael doesn't mention getting the uri using 'this' so maybe it's best to avoid it
            // please add a comment if you know why this might be bad
            //console.log(this.uri.href);
            });
});

  app.get("/api/nordeaToken",function(req,res){
    console.log("API nordeaToken");
    
    console.log(myNordea);
  }
);
  
  app.get("/api/accounts", function(req, res) {
    console.log("app.get -api accounts ");
    db.collection(ACCOUNTS_COLLECTION).find({}).toArray(function(err, docs) {
        console.log("app.get -api accounts - after find ");
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        res.status(200).json(docs);
        
      }
    });
  });
  
  app.post("/api/accounts", function(req, res) {
    var newAccount = req.body;
    newAccount.createDate = new Date();
  
    if (!req.body.name) {
      handleError(res, "Invalid user input", "Must provide a name.", 400);
    }
  
    db.collection(ACCOUNTS_COLLECTION).insertOne(newAccount, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  });

// 
app.get("/api/rbss",function(req, res) {
    var request = require("request");
var options = { method: 'GET',
  url: 'https://bluebank.azure-api.net/api/v0.7/customers/2ad4947f-dd3a-44a2-8055-b2c1d9c8b6b0/accounts',
  headers: 
   { 'Postman-Token': 'a12efa51-74d0-f204-b715-99919abe2dfe',
     'Cache-Control': 'no-cache',
     Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE1MTY5OTg5NTAsIm5iZiI6MTUxNjk5NTM1MCwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tL2Q1Zjg1NjgyLWY2N2EtNDQ0NC05MzY5LTJjNWVjMWEwZThjZC92Mi4wLyIsInN1YiI6IjJhZDQ5NDdmLWRkM2EtNDRhMi04MDU1LWIyYzFkOWM4YjZiMCIsImF1ZCI6IjQwOTU3YjljLTYzYmMtNGFiNC05ZWNiLTY3YjU0M2M4ZTRjYSIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNTE2OTk1MzUwLCJhdXRoX3RpbWUiOjE1MTY5OTUzNTAsIm9pZCI6IjJhZDQ5NDdmLWRkM2EtNDRhMi04MDU1LWIyYzFkOWM4YjZiMCIsIm5hbWUiOiJNb3NoZSIsImZhbWlseV9uYW1lIjoiTW9zaGUiLCJnaXZlbl9uYW1lIjoiTW9zaGUiLCJlbWFpbHMiOlsibW9zaGVAZXRhdXJldW0uY29tIl0sInRmcCI6IkIyQ18xX0JsdWVCYW5rU1VTSSJ9.puU8_I7u4vYMTPxulXAWYkbpCAc_gRRr4lxGCYyEF6rmWuI1xd1DnecmBdWfPxHyYTmeCdB9kxL0GwLcwEUY2oYqtXGirqVmsOahSdldMGPZmcxmKOVdX0_OoRAQGgKtbh8IyoppGjhbIUCdczTFI4IDX6PO7R5eXQKhYsZB6j-AzAUJ0iplYB8HjmwQUBSUS2paiTrqesQEbfh3S2Ios8K-b54BvDOUHLz4GRKDSAWz2Wb83mkH30NAq_utcAcy-t3ky3aQAdjqo3H_fX9nK2_ZZQZ1Llglj0VNdguM6SJ6aOKt53O6gf0pXxQvn9V_BeZYHFJcvtk60DpujTBotg',
     'Ocp-Apim-Subscription-Key': '740ee16025204f3eb0a74c8eac881184' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);

  res.status(200).json(body);
});


});
// get cfo token api
  app.get("/api/token",function(req, res) {   
    console.log("Getting tokken");
    var bank=req.query.bank;
    var cfoid=req.query.cfoid;
    var code ;
    var client_id;
    var client_secret;
    console.log("cfoid = " +cfoid);
    console.log("bank = "+ bank);
    // 1.go to db collection cfoAccessInfo and get code
    db.collection(CFO_ACCESS_INFO_COLLECTION).find({$and:[{"cfo_id":cfoid},{"bank_name": bank}]}).toArray(function(err, docs) {
        console.log("get cfo code");
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        cfo_code = docs[0].code;
        console.log("code is " , cfo_code);       
      }
          //2.go to clientInfo and get client id and secret  
    db.collection(CLIENT_INFO_COLLECTION).find({"bank_name":bank}).toArray(function(err, docs) {
        console.log("get client id and secret");
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        client_id = docs[0].client_id;
        client_secret = docs[0].client_secret;
        console.log("client_id " , client_id); 
        console.log("client_secret " , client_secret); 
      }
        //3.call nordea_get_token with above params.
       // const myNordea = require('./nordea_get_token');
       // myNordea.getToken(client_id , client_secret,code, function(err,data){
        //    console.log("call nordea_get_token");
        //    if (err) {
         //       handleError(res, err.message, "Failed to get contacts.");
        //    } else {
        //        console.log("get token response");
        //        console.log(data.toString());
        //    } 
        ////////////////////////////////////////////////////////////////////
        console.log("getToken");
        console.log("getToken client_id " +client_id);

        var request = require("request");

        var options = { method: 'POST',
           url: 'https://api.nordeaopenbanking.com/v1/authentication/access_token',
           headers:
              {  'Cache-Control': 'no-cache',
                 'X-IBM-Client-Secret': 'C4mX1uV3bO0vV0yN0tB4pD4rH7dW0kN0wL8rT5qJ4aD4fQ3fM1',
                 'X-IBM-Client-ID': 'a9dbb627-c34e-4523-b51e-2256739182b2',
                 'Content-Type': 'application/x-www-form-urlencoded' },
           form:
              { code: cfo_code,
                 redirect_uri: 'http://www.etaureum.com' } };
        
        request(options, function (error, response, body) {
           if (error) throw new Error(error);
        
           console.log(body);
        });

    
        var qs = require("querystring");
        var http = require("https");
       
        var options = {
          "method": "POST",
          "hostname": "api.nordeaopenbanking.com",
          "path": [
            "v1",
            "authentication",
            "access_token"
          ],
          "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-IBM-Client-ID": client_id,
            "X-IBM-Client-Secret": client_secret,
            "Cache-Control": "no-cache",
            "Postman-Token": "6b98ed2f-92fe-d461-5f1f-1efbe9e0273b"
          }
        };
    
        var req = http.request(options, function (res) {
          var chunks = [];
    
          res.on("data", function (chunk) {
            chunks.push(chunk);
          });
    
          res.on("end", function () {
             body = Buffer.concat(chunks);
            
            //4.insert token result to cfoAccessInfo . also update expiration date
            // get torken from data
            // TODO -get both from response of getToken
            var token = "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiZGlyIn0..wRu3nvNhSUy2AbPN.xCPf9pJvJejGvueXwalVFGag6ErG3ag5NSRAZd0oHBE8IC61kpusLrQ7-83RrhDGjoG-V0p0i1IlmxUGRynFE46WuTT8sCjJfBkzEOVOo2mIJWLnLwD_YWMuSqiCXq-cTssjYUAl0KwYuI6kuJVfeOo-GRKQSkiADSYqc41JC3-XfRt-bLUBj7y-VqFtNMsWIS-_Ho8MZD7GYGIvutx1W6WtYEykwIYmUr8XMOOxcpMfCMwdMXlDo9YDrT5Sx-pt-eBZOtTVy5hTmHXptV2hrdqg63j2M1KGQcC0wE-IENXXfVV0Lwbv6EQu1UDlRPHqT6XmQqMqxjn6PoBsCWBEwcRPL_E5dkUtqa69sBmAAKt51bs7sxFZ7z20n5TYQA06ehbpIl6PspacEjY2ycCRGmnMQBD509kEhovp1-aYn6ukS-NwZoCf-lfuMw7kh0t6sACru5lyokqgVoOP7VsqFYQO_FbB2iks4S06VgJg-FkPzOYIPC4HRj7VNwtXJiFIuvk9nWXce4-J6Sx8ft3Qbu_jHEI6k7HNd1IO3juldKoWoi8mheWNpLqo1kSsvMaQAcErSLuBiLgt-SzkmvvImByzBAKbgciTNIq0YCMGL0rvnGktfXEgyxVb3Vr7qXX_yMAIrHIpKHrzURz8axfQvLYm01nJKPScsg9oZoNsk5BxGkgtQfta3CUt09EKhOC70xFQpx_ZFKIPkT99bdsZmvAUW__TONd_F8sW9tJSm3viwXrGG30tK-2w_gG0Asj7Wdt65xS5q6smCng9fyErWxT-ngV-jhq3CrRr-W4Vz7LLagezyNxbulSjZZbgeECIJAt48D-ix33hYbFJpOEedmOneTmmYFxP0ecEbd9udT15Y4YIcQLH7GzJFijFFHQ8cVCRjpK6J2YBtR-lnmVmuyJhLclnPVx6iID8XE8qKpy-NK4MR3pYXS4VUZIWVPX3UcamUgpS5w56JyvOgThRptFSsFJhsjmW-T-ewcKPklqU4PXAJX-nWbTWnSmB9rs9rmiNRJrW1HSI5ZEzfQnsiehCwiFlqrIzS1dZ9AZp0APMCvJmCpF4viD2sq5dKP0ySejZvO4TWdrB5HPZszlMYFus4kYO1FcZUxYtczjC72AODunxQQb4pHuOGkjKmonbyn5LZIdqWRxqE7vdc25RZ4TqGQ5dBA61aSzVk0DEO4FppABZa1E99g_O7deSrA.EwW8Yziswh4XHfRmGmxe5Q";
            var timeInInt = 2222333; 
            var date = new Date(timeInInt);

            console.log("update token in db");

            db.collection(CFO_ACCESS_INFO_COLLECTION).update({$and:[{"cfo_id":cfoid},{"bank_name": bank}]},
                                                                {$set:{'current_token':token}});
            db.collection(CFO_ACCESS_INFO_COLLECTION).update({$and:[{"cfo_id":cfoid},{"bank_name": bank}]},
                                                                {$set:{'token_expiration_date':date}});



          });
        });
    
        req.write(qs.stringify({ code: cfo_code,
          redirect_uri: 'http://www.etaureum.com' }));
        req.end();

        //////////////////////////////////////////////////////////////


            


        });
    
    });   
  });

  // get cfo balance
  app.get("/api/balance1",function(req, res) { 
    console.log("Getting balance");
      var token;
      var tokenExpirationDate;
      var bank=req.query.bank;
      var cfoid=req.query.cfoid;
      var client_id ;
      var client_secret;
      console.log("bank = " +bank);
      console.log("cfoid = " +cfoid);
    //1.go to db collection cfoAccessInf and get token
    db.collection(CFO_ACCESS_INFO_COLLECTION).find({$and:[{"cfo_id":cfoid},{"bank_name": bank}]}).toArray(function(err, docs) {
        console.log("get cfo token");
      if (err) {
        handleError(res, err.message, "Failed to get contacts.");
      } else {
        token = docs[0].current_token;
        tokenExpirationDate = docs[0].token_expiration_date;
        tokenDateToInt = new Date(tokenExpirationDate).getTime();
        console.log("tokenExpirationDate " , tokenExpirationDate); 
        console.log("tokenDateToInt " , tokenDateToInt); 

        now = Date.now();
        console.log("now " , now); 
        if (tokenDateToInt < now){
            // call token api in order to get a new token
            //TODO
        } 
        console.log("token " , token);  
        //2.go to clientInfo and get client id and secret
        db.collection(CLIENT_INFO_COLLECTION).find({"bank_name":bank}).toArray(function(err, docs) {
            console.log("get client id and secret");
          if (err) {
            handleError(res, err.message, "Failed to get contacts.");
          } else {
            client_id = docs[0].client_id;
            client_secret = docs[0].client_secret;
            console.log("client_id " , client_id); 
            console.log("client_secret " , client_secret); 
          }
          //3.call nordea_get_balance with above params
         // const myNordea = require('./nordea_get_balance');
        // myNordea.getNordeaBalance(client_id,client_secret,token,function(err,data){
        //     console.log("after getNordeaBalance");
        //     console.log(data);
        // });
        ////////////////////////////////////////////////////////////
        var http = require("https");
        console.log("in balance");
        var options = {
            "method": "GET",
            "hostname": "api.nordeaopenbanking.com",
            "port": null,
            "path": "/v1/accounts",
            "headers": {
                "x-ibm-client-id": client_id,
                "authorization": "Bearer " + token,
                "content-type": "application/json",
                "x-ibm-client-secret": client_secret,
                "cache-control": "no-cache",
                "postman-token": "fc7137b9-1614-061f-ff82-9d7587c967ba"
            }
        };
        
        var req;
        
        var nordeaAmount;
        
        var req = http.request(options, function (res1) {
            var chunks = [];
        
            res1.on("data", function (chunk) {
                chunks.push(chunk);
            });
        
            res1.on("end", function () {
                var body = Buffer.concat(chunks);
               // console.log(body.toString());
                nordeaBalance = Buffer.concat(chunks).toString();
                var smyJSON = nordeaBalance;
                smyJSON;
                var myString = JSON.stringify(smyJSON);
                var myParse = JSON.parse(smyJSON);
        
                //nordeaBalance =  myParse.response.accounts[1].account.currency + ' ' + myParse.response.accounts[1].balances[1].amount.toString()
                console.log("prining one account");
                nordeaBalance = myParse
                console.log(nordeaBalance);

                // parse accounts
                var accountArray =[];
                accountArray = nordeaBalance.response.accounts;
                console.log(accountArray);
                var accountsJsonArray = [];
                console.log(accountArray.length);
                for (var i =0 ; i < accountArray.length; i++){
                    var account = accountArray[i].account.identification.iban;
                    var currency = accountArray[i].account.currency;
                    var amount = accountArray[i].balances[i].amount;
                    var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":bank};
                    accountsJsonArray[i] = newAccount;
                }
                res.status(200).json(accountsJsonArray);      
            });
        });
    
        req.end();   
         console.log("after end");
         



        //////////////////////////////////////////////////////
         
      });
     } 
    });
});




  function auth(req,res){
    var http = require('http');

   
        var url = 'https://api.nordeaopenbanking.com/v1/authentication?client_id=a9dbb627-c34e-4523-b51e-2256739182b2&state=102092&redirect_uri=https://www.etaureum.com/';
        var url2 = 'https://api.nordeaopenbanking.com/v1/authentication?client_id=a9dbb627-c34e-4523-b51e-2256739182b2&state=102092'

        res.redirect(url, function (err, data) {
            if (err) return console.error(err);
            console.log(data.toString());
         });
        }



app.get("/api/starlings",function(req, res) { 
//// Start starling get balance from my nostro
// first we get the account (in sandbox each customer has only one account)
console.log("api- starling");
var http = require("https");

var options = {
"method": "GET",
"hostname": "api-sandbox.starlingbank.com",
"port": null,
"path": "/api/v1/accounts",
"headers": {
"accept": "application/json",
"content-type": "application/json",
"authorization": "Bearer t5d0gJzvdPPmNAJkmNNVWZrNzvrBhjN2e4yjqg9Jv2iJrzA1nndrkucc3qrrJZNJ",
"cache-control": "no-cache"
}
};

var req;
var starlingBalance;
var starlingAmount;
var fidorBalance;
var fidorAmount;
var bank = "Starling";

req = http.request(options, function (res) {
var chunks = [];
res.on("data", function (chunk) {
chunks.push(chunk);
});

res.on("end", function () {
        var body = Buffer.concat(chunks);
        starlingBalance = Buffer.concat(chunks).toString();
        //console.log(body.toString());

        var smyJSON = starlingBalance;
        smyJSON;
        var myString = JSON.stringify(smyJSON);
        var myParse = JSON.parse(smyJSON);
        console.log(myParse);

        var accountsJsonArray = [];   
        var account = myParse.accountNumber;
        var currency = myParse.currency;

        // now lets get the balance

        ////////////////////////////////////////////////

        var options = {
            "method": "GET",
            "hostname": "api-sandbox.starlingbank.com",
            "port": null,
            "path": "/api/v1/accounts/balance",
            "headers": {
            "accept": "application/json",
            "content-type": "application/json",
            "authorization": "Bearer t5d0gJzvdPPmNAJkmNNVWZrNzvrBhjN2e4yjqg9Jv2iJrzA1nndrkucc3qrrJZNJ",
            "cache-control": "no-cache"
            }
            };
            
            var req1;
            req1 = http.request(options, function () {
            var chunks = [];
            res.on("data", function (chunk) {
            chunks.push(chunk);
            });
            
                res.on("end", function () {
                    console.log("second ");
                    var body = Buffer.concat(chunks);
                    starlingBalance = Buffer.concat(chunks).toString();
                   // console.log(body.toString());
                
                    var smyJSON = starlingBalance;
                    smyJSON;
                    var myString = JSON.stringify(smyJSON);
                    var myParse = JSON.parse(smyJSON);
                    //console.log(myParse);
                
                    var amount =   myParse.clearedBalance;
                    var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":bank};
                    accountsJsonArray[0] = newAccount;
                    //console.log(accountsJsonArray);
                    res.status(200).json(accountsJsonArray);      

                    
                
                });
            });
            
            req1.end();
            
            }); 


    });

    req.end();

});


var request = require("request");
var userDetails;

var errHandler = function(err) {
    console.log(err);
}

app.get("/api/overallbalance",function(req, res) { 
    // 1. first, get all banks of the current cfo from db collection cfoAccessInfo
    //  and save all information in a map of jsons
    // make a list of all banks for this 
    var banks = [];
    var currentCfoAccessInfoDictionary ={};
    var cfoid=req.query.cfoid;
    var currentCfoSub = req.query.currentCfoSub ;
    console.log("req.query id is : " + req.query);
    console.log("CFO id is : " + cfoid);
    console.log("currentCfoSub id is : " + currentCfoSub);

    db.collection(CFO_ACCESS_INFO_COLLECTION).find({$and:[{"cfo_id":cfoid},{"sub": currentCfoSub}, {"record": "record"}]}).toArray(function(err, docs) {    
        if (err) {
            handleError(res, err.message, "Failed in auth.");
        }else{
            console.log("Auth passed successfully ");
        }

    db.collection(CFO_ACCESS_INFO_COLLECTION).find({"cfo_id":cfoid}).toArray(function(err, docs) {
        if (err) {
            handleError(res, err.message, "Failed to get contacts.");
        } else {
            for (var i =0 ; i < docs.length; i++){
                currentCfoAccessInfoDictionary[docs[i].bank_name] = docs[i];
            }
            console.log("currentCfoAccessInfoDictionary = ");
            Object.keys(currentCfoAccessInfoDictionary).forEach(function(key) {
                var val = currentCfoAccessInfoDictionary[key];
                banks.push(val.bank_name);
                console.log(banks);

            });
        }
    

    // for each of of the banks of the cfo do
    var accountsJsonArray = [];
    //var banks = ['Nordea','RBS','Starling']; // will be changed by info from db
    var arrayOfPromises = [];
    for (var i =0 ; i < banks.length; i++){
        var currenBank = banks[i];
        var token = currentCfoAccessInfoDictionary[currenBank].current_token;
        switch(currenBank) {
        case 'Nordea':
            console.log("Case Nordea");
            var clientSecret = clientInfoDictionary[currenBank].client_secret;
            var clientID = clientInfoDictionary[currenBank].client_id;
            var dataPromise = getNordeaBalance(clientID,clientSecret,token);
            dataPromise.then(function(result) {
                var userDetails = result;
                console.log(userDetails);
        
                // parse accounts
                var accountArray =[];
                accountArray = userDetails.response.accounts;
                console.log(accountArray);
                
                console.log(accountArray.length);
                for (var i =0 ; i < accountArray.length; i++){
                    var account = accountArray[i].accountNumber.value;
                    var currency = accountArray[i].currency;
                    var amount = accountArray[i].availableBalance;
                    var accountType = accountArray[i].accountType;
                    if(accountType == "Current") {
                        accountType = "Checking";
                    }
                    var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":"Nordea", "type":accountType  ,"bank_img" : "assets/images/starling.png"};
                    accountsJsonArray.push(newAccount);
                }
                //res.status(200).json(accountsJsonArray);  
            }, function(err) {
                console.log(err);
            });
            arrayOfPromises.push(dataPromise); 
            break;
        case 'RBS':
            console.log("Case RBS");
            var subscriptionKey = clientInfoDictionary[currenBank].Ocp_Apim_Subscription_Key;

            var dataPromise = getRbsBalance(token,subscriptionKey);
            dataPromise.then(function(result) {
                var userDetails = result;
                console.log(userDetails);
                var myParse = JSON.parse(userDetails);
        
                // parse accounts
                var noOfAccounts = myParse.meta.count;
                console.log("number of accounts " +noOfAccounts);
        
                var accountArray =[];
                accountArray = myParse.results;
                console.log(accountArray);
                console.log(accountArray.length);
                for (var i =0 ; i < accountArray.length; i++){
                    var account = accountArray[i].accountNumber;
                    var currency = "GBP"; //accountArray[i].accountCurrency;
                    var amount = accountArray[i].accountBalance;
                    var accountType = accountArray[i].accountFriendlyName;
                    if (accountType == "Holiday"){
                        accountType = "Long Term";
                    }
                    var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":"RBS" , "type" : accountType ,"bank_img" : "assets/images/rbs.png" };
                accountsJsonArray.push(newAccount);
                }
                //res.status(200).json(accountsJsonArray);  
            }, function(err) {
                console.log(err);
            });
            arrayOfPromises.push(dataPromise); 
            break;
        case 'Starling':
            console.log("Case Starling");
            var newAccount = {"account_no" : "", "currency": "", "amount" : "", "bank":"" , "type":"Checking" ,"bank_img" : "assets/images/starling.png"};
            var dataPromise = getSterlingAccounts(token);
            dataPromise.then(function(result) {
                var userDetails = result;
                console.log(userDetails);
                var myParse = JSON.parse(userDetails);
                var account = myParse.accountNumber;
                var currency = myParse.currency;
                newAccount.account_no = account;
                newAccount.currency = currency;
                newAccount.bank = "Starling";
                console.log(newAccount);  
            }, function(err) {
                console.log(err);
            });
            arrayOfPromises.push(dataPromise);   
            var dataPromiseForBalance = getSterlingBalance(token);
            dataPromiseForBalance.then(function(result) {
                var userDetails = result;
                console.log("After getSterlingBalance");
                console.log(userDetails);
                var myParse = JSON.parse(userDetails);
                var amount = myParse.amount;
                newAccount.amount = amount;
                console.log(newAccount);
                accountsJsonArray.push(newAccount);       
            }, function(err) {
                console.log(err);
            });     
            arrayOfPromises.push(dataPromiseForBalance); 
            break;
        default:
            //code block
        }
    }

    var publish = () => {res.status(200).json(accountsJsonArray);  };

    Promise.all(arrayOfPromises).then(publish);
})});

});

app.get("/api/starling",function(req, res) { 
    console.log("in Api Starling");
    var newAccount = {"account_no" : "", "currency": "", "amount" : "", "bank":""};
    var accountsJsonArray = [];
    var dataPromise = getSterlingAccountsHC();
    dataPromise.then(function(result) {
        userDetails = result;
        console.log("After getSterlingAccounts");
        console.log(userDetails);
        var myParse = JSON.parse(userDetails);
        var account = myParse.accountNumber;
        var currency = myParse.currency;
        newAccount.account_no = account;
        newAccount.currency = currency;
        newAccount.bank = "Starling";
        console.log(newAccount);    
        var dataPromiseForBalance = getSterlingBalanceHC();
        dataPromiseForBalance.then(function(result) {
            userDetails = result;
            console.log("After getSterlingBalance");
            console.log(userDetails);
            var myParse = JSON.parse(userDetails);
            var amount = myParse.amount;
            newAccount.amount = amount;
            console.log(newAccount);
            accountsJsonArray[0] = newAccount;
            res.status(200).json(accountsJsonArray);  

        }, function(err) {
            console.log(err);
        });

    }, function(err) {
        console.log(err);
    });
});

app.get("/api/rbs",function(req, res) { 
    console.log("in Api rbs");
    var dataPromise = getRbsBalanceHC();
    dataPromise.then(function(result) {
        userDetails = result;
        console.log(userDetails);
        var myParse = JSON.parse(userDetails);

        // parse accounts
        var noOfAccounts = myParse.meta.count;
        console.log("number of accounts " +noOfAccounts);

        var accountArray =[];
        accountArray = myParse.results;
        console.log(accountArray);
        var accountsJsonArray = [];
       console.log(accountArray.length);
        for (var i =0 ; i < accountArray.length; i++){
            var account = accountArray[i].accountNumber;
            var currency = "GBP"; //accountArray[i].accountCurrency;
            var amount = accountArray[i].accountBalance;
            var accountType = accountArray[i].accountFriendlyName;
            var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":"RBS", type:accountType };
          accountsJsonArray[i] = newAccount;
        }
        res.status(200).json(accountsJsonArray);  
    }, function(err) {
        console.log(err);
    });
    
    
});

app.get("/api/nordbal",function(req, res) { 
    var dataPromise = getNordeaBalanceHC();
    dataPromise.then(function(result) {
        userDetails = result;
        console.log(userDetails);

                // parse accounts
        var accountArray =[];
        accountArray = userDetails.response.accounts;
        console.log(accountArray);
        var accountsJsonArray = [];
        console.log(accountArray.length);
        for (var i =0 ; i < accountArray.length; i++){
            var account = accountArray[i].accountNumber.value;
            var currency = accountArray[i].currency;
            var amount = accountArray[i].availableBalance;
            var newAccount = {"account_no" : account, "currency": currency, "amount" : amount, "bank":"Nordea"};
            accountsJsonArray[i] = newAccount;
        }
        res.status(200).json(accountsJsonArray);  
    }, function(err) {
        console.log(err);
    });
    
    
});

///////////// Balance Promiss methods ////////////////

function getNordeaBalanceHC() {

    var options = { method: 'GET',
    url: 'https://api.nordeaopenbanking.com/v2/accounts',
    headers: 
    { 'Postman-Token': '8fabca65-2a7e-63ce-0fc6-cac2bf942732',
        'Cache-Control': 'no-cache',
        'X-IBM-Client-Secret': 'qT6fD3eF2sR4iX6bN5jJ0yG3aJ8dV4gE0qX2yB4nE6yP3uX3kI',
        'X-IBM-Client-ID': 'a9dbb627-c34e-4523-b51e-2256739182b2',
        'Content-Type': 'application/json',
        Authorization: 'Bearer eyJjdHkiOiJKV1QiLCJlbmMiOiJBMTI4R0NNIiwiYWxnIjoiZGlyIn0..GKU4gwQKDwXLYrnD.xI6gMqRJeaD0VrxhZbU4IcPJjyL6zJNleHvWrUCtl3CzRr0kf_NTMmmw7jd2WXlQrnt-K-c--uBVAaZyK3GJmXJqW3SgAoFi4vSTZD_klIlNFOl3doZmpgDfcexkZoiEMDkl5kONcPavt_XIygWOeoO0nK2GfqXhojsBOlyh3l2PW5gwo5QrZ1HbWRbUX3jcDQEV8i3jca4JPjcAUs0SyB6g6M5VSrxiwLSA2xA8dUsL6IIQQVrAw6fHkO6vL9xRBulY3T6Con78Oh4WjCMFqWMBQx9WXMgke-Zp0Mm4BeWbGbP_W4Yi29lzGYehvTjaimXEY3bE1C_eR1d51Ql76eiZcQ7do2h1ibfalRpqgWktujOuRaU6CxRaj9Qmqgaf7OeC7npUHN46nBaM0Pu3MmRv-j8_aH97FOp8i9JJ2OUxIHBnu3LUtTUprAYmfn3Umk_Sv0nN14aiZIlGqpD93A5tiVrxWJOe0EnDWHWGeRZsyQMio1qPsLUuwSD5fFCg5tUvhpXiQXgnOjBBvLTnQyRlnZl87tskg_TavfB26qfv1vnwvkZ_qGedzIFd5zjsA6vKPuQcboszFFVcJhuogPQ2AGyU_w_K4fdWcuaLB6UbhzsXdiCxZ-o7Rdb4f4zqGD36GejJmlI_dXMW-_dEIFdmdYA_8l6BFV8h1MgeDlbYbJ2KTgDHTbjbg-r5mZLfAlmVIyIJDCInunZEr4gK-CoHHQv-Jl1Za0gYqoO1H6_Nh8FNM6Se9oAOaFwbqDdFb3AHjKkYJv2B4DdW51yU1Ivh9mWvHGbdpJCLVWu27_Mki23AmfvdDgKUC1gWRHLqi7Bo3NI9iP4CyIoSr5yzIoDCKS5razh3R7zEf1CPg4lqHQbXQniZRdc2phc5Daz65ei5f2XE1J5fuDWrs9Qjok4mG1mmJqHTgnsKUoouR6XNRglQZnqk-9YlO2bLkATJd57_BVbE0TBBxJYHJDmQmwH0H7pAIJse5gAg7Q.2TfhedUqKnDQ_DQJW6ET7w' },
    json: true };

    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });
    });
} 

function getNordeaBalance(clientID,clientSecret,token) {

    var options = { method: 'GET',
    url: 'https://api.nordeaopenbanking.com/v2/accounts',
    headers: 
    { 'Postman-Token': '8fabca65-2a7e-63ce-0fc6-cac2bf942732',
        'Cache-Control': 'no-cache',
        'X-IBM-Client-Secret': clientSecret,
        'X-IBM-Client-ID': clientID,
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' +token },
    json: true };

    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });
    });
} 


function getRbsBalanceHC(){
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://bluebank.azure-api.net/api/v0.7/customers/2ad4947f-dd3a-44a2-8055-b2c1d9c8b6b0/accounts',
      headers: 
       { 'Postman-Token': 'a12efa51-74d0-f204-b715-99919abe2dfe',
         'Cache-Control': 'no-cache',
         Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ilg1ZVhrNHh5b2pORnVtMWtsMll0djhkbE5QNC1jNTdkTzZRR1RWQndhTmsifQ.eyJleHAiOjE1MTgyMTkwMzYsIm5iZiI6MTUxODIxNTQzNiwidmVyIjoiMS4wIiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5taWNyb3NvZnRvbmxpbmUuY29tL2Q1Zjg1NjgyLWY2N2EtNDQ0NC05MzY5LTJjNWVjMWEwZThjZC92Mi4wLyIsInN1YiI6IjJhZDQ5NDdmLWRkM2EtNDRhMi04MDU1LWIyYzFkOWM4YjZiMCIsImF1ZCI6IjQwOTU3YjljLTYzYmMtNGFiNC05ZWNiLTY3YjU0M2M4ZTRjYSIsIm5vbmNlIjoiZGVmYXVsdE5vbmNlIiwiaWF0IjoxNTE4MjE1NDM2LCJhdXRoX3RpbWUiOjE1MTgyMTU0MzYsIm9pZCI6IjJhZDQ5NDdmLWRkM2EtNDRhMi04MDU1LWIyYzFkOWM4YjZiMCIsIm5hbWUiOiJNb3NoZSIsImZhbWlseV9uYW1lIjoiTW9zaGUiLCJnaXZlbl9uYW1lIjoiTW9zaGUiLCJlbWFpbHMiOlsibW9zaGVAZXRhdXJldW0uY29tIl0sInRmcCI6IkIyQ18xX0JsdWVCYW5rU1VTSSJ9.Epxmclpj7hzme_qlxXc7_sUiLbKFwMy3OdZAIQ7hCpDTolKuPtkL6jyFfst9JcWD4lmm-5Eao-KH7fL7JjRrW1z6PTZ4KA2RuWBjWH7T1wPvaQwaoouwho2QapMqT7TFnUhSfudYkjy2lLx8HjP3sMynvZ_XeIGpw0B-F-SV6aD4GGhoG1lA2pcdC1iLCmHnIHfSMqOpjUZ0jox106oI8SqbsgK2vfw56FpXMq-3dobImrN6WKId0AAo2S0NHOrBEG6p0EdkE14FFacMfXRz38VR_nR_bkc86ElnOSa2_9-rkuf8yjkXEc3LNNuUCcrj0ovBA6aADuDNpvv5J7-9fQ',
         'Ocp-Apim-Subscription-Key': '740ee16025204f3eb0a74c8eac881184' } };
    
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });  
    });  
}

function getRbsBalance(token, subscription_key){
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://bluebank.azure-api.net/api/v0.7/customers/2ad4947f-dd3a-44a2-8055-b2c1d9c8b6b0/accounts',
      headers: 
       { 'Postman-Token': 'a12efa51-74d0-f204-b715-99919abe2dfe',
         'Cache-Control': 'no-cache',
         Authorization: 'Bearer '+token,
         'Ocp-Apim-Subscription-Key': subscription_key } };
    
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });  
    });  
}

function getSterlingAccountsHC(){
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://api-sandbox.starlingbank.com/api/v1/accounts',
      headers: 
       { 'Accept': "application/json",
         'Content-type': 'application/json',
         'Authorization': 'Bearer kFEVtY5k39MLTiCuTNpcDELJ0owl3PN0uD1hja7aTwJYL4MS6Pi1RudwyDFDNb3Z'
         }
       };
    
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });  
    });  
}

function getSterlingAccounts(token){
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://api-sandbox.starlingbank.com/api/v1/accounts',
      headers: 
       { 'Accept': "application/json",
         'Content-type': 'application/json',
         'Authorization': 'Bearer '+token
         }
       };
    
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });  
    });  
}

function getSterlingBalanceHC(){
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://api-sandbox.starlingbank.com/api/v1/accounts/balance',
      headers: 
      { 'Accept': "application/json",
      'Content-type': 'application/json',
      'Authorization': 'Bearer kFEVtY5k39MLTiCuTNpcDELJ0owl3PN0uD1hja7aTwJYL4MS6Pi1RudwyDFDNb3Z'
      } 
    };
    
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });  
    });  
}

function getSterlingBalance(token){
    var request = require("request");
    var options = { method: 'GET',
      url: 'https://api-sandbox.starlingbank.com/api/v1/accounts/balance',
      headers: 
      { 'Accept': "application/json",
      'Content-type': 'application/json',
      'Authorization': 'Bearer '+token
      } 
    };
    
    return new Promise(function(resolve, reject) {
        request(options, function (error, response, body) {
        if (error) throw new Error(error);
        resolve(body);
        });  
    });  
}