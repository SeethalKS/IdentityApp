
import { CanActivateFn,ActivatedRouteSnapshot,Router,RouterStateSnapshot,UrlTree, ActivatedRoute } from '@angular/router';
import { Observable,map } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { SharedService } from '../shared.service';
import { User } from '../models/user';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn:'root'
})
 export class AuthorizationGuard{
  constructor(private accountService:AccountService,
         private sharedService:SharedService,
         private router :Router        
  ){}
  canActivate(
    route:ActivatedRouteSnapshot,
    state:RouterStateSnapshot):Observable<boolean>{
      return this.accountService.user$.pipe(
        map((user:User | null)=>{
          if(user){
            return true;
          }else{
            this.sharedService.showNotification(false,'Restricted Area','Leave immediately');
            this.router.navigate(['account/login'],{queryParams:{returnUrl:state.url}})
            return false;
          }
        })
      );
    }
 }
// export const authorizationGuard: CanActivateFn = (route, state) => {
//   return true;
// };
