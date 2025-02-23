import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../../account/account.service';
import { Observable, take } from 'rxjs';


@Injectable()

export class JwtInterceptor implements HttpInterceptor{
  
  constructor(private accountService:AccountService){}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: user => {
        if(user){
          //clone from the coming request and add authorization header to that
          request = request.clone({
            setHeaders:{
              Authorization : `Bearer ${user.jwt}`
            }
          });
        }
      }
    })
    return next.handle(request);
  }
}

// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req);
// };
