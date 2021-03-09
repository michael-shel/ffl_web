import { Injectable } from '@angular/core';
import { Router ,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private storage: LocalStorageService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var res = this.storage.get('selectedStore');
        if (res) {
          console.log(res);
          return false;
        } else {
          console.log('no access');
          this.router.navigate(['/catalog/0']);
          return true;
        }

  }
  
}
