import { Injectable }     from '@angular/core';
import { CanActivate, Router }    from '@angular/router';
import { GlobalService } from '../globalService';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private api:GlobalService,private router:Router){}
  canActivate() {
    // console.log('AuthGuard#canActivate called');
    if(localStorage.getItem('token')){
       // console.log(localStorage.getItem('token'))
        this.api.loggedIn();
        // this.router.navigateByUrl('/pages/ui-features/buttons')
        return true;
    }else{
        console.log(`token not found`);
        return true;

    }
  }
}