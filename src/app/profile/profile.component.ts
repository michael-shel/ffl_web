import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { DataService } from '../services/data.service';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
interface Tabs {
  id : number;
  active: boolean;
  title: string;
  title_ru:string;
  title_eng:string
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  tabs: Tabs[] = [
    {id: 1,active: true, title: 'Мої Налаштування',title_eng: 'My setting', title_ru: 'Мои настройки'},
    {id: 2,active: false, title: 'Мої Закази',title_eng: 'My orders', title_ru: 'Мои заказы'},
    {id: 3,active: false, title: 'Мої Адреси',title_eng: 'My addresses', title_ru: 'Мои адреса'},
  ];
lang;
  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private dataService: DataService,
    public translate: TranslateService
  ) {
    this.lang = this.dataService.getSessionLanguage().value;
   }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang
  });
  }

  activateTab(tab){

    this.tabs.forEach(item => {
      if (tab.title == item.title) {
        item.active = true;
      }
      else{
        item.active = false;
      }
    });
  }

  logout(){
    this.authService.logout();
    this.dataService.restorePaginator();
    this.router.navigate(['/catalog/0']);
  }

}
