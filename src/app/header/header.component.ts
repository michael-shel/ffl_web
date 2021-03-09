import { Component, OnInit } from '@angular/core';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faCloudMeatball } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../services/data.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectStoreComponent } from '../select-store/select-store.component'
import { AuthControllerComponent } from '../auth-controller/auth-controller.component'
import { BehaviorSubject, Observable } from 'rxjs';
import { CartService } from '../services/cart.service';
import { SearchService } from '../services/search.service';
import { EnvService } from '../services/env.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../services/user';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  providers: [SearchService]
})
export class HeaderComponent implements OnInit {

  user: User ;
  user$: Observable<User | null>;
  faMapMarkerAlt = faMapMarkerAlt;
  faUser = faUser;
  faCloudMeatball = faCloudMeatball;
  faUtensils = faUtensils;
  phones = [];
  activePhone = '';

  langs = [
    {
    title: 'укр',
    value: 'ua'
    },
    {
      title: 'рус',
    value: 'ru'
    },
    {
      title: 'eng',
    value: 'en'
    },
  ];
  activeLang = this.dataService.getSessionLanguage();


  address;
  selectedStore;
  store_title = 'Вибрати магазин';
  cartItemCount: BehaviorSubject<number>;
  totalPrice: BehaviorSubject<number>;
  totalWeight: BehaviorSubject<number>;
  productPrice: BehaviorSubject<number>;
  totalDelivery: BehaviorSubject<number>;
  input_len = 0;
  focus = false;
  blur = true;
  results: object = null;
  searchTerm$ = new Subject<string>();
  url:any;
  results_none = false;
  constructor( 
    private dataService: DataService,
    private modalService: NgbModal,
    private cartService: CartService,
    private searchService: SearchService,
    private EnvService: EnvService,
    private router: Router,
    private authService: AuthService,
    public translate: TranslateService
      ) {
        translate.addLangs(['en', 'ru', 'ua']);
        translate.setDefaultLang(this.activeLang.value);
        this.url = EnvService.URL;
        this.user$ = this.authService.watchUser();
      this.searchTerm$.subscribe(inputData => {
        this.input_len = inputData.length;
      });
    
    this.searchService.search(this.searchTerm$).subscribe(results => {
      this.results = results.data;
      if(this.ObjectSize(this.results) == 0){
        this.results_none = true;
      }
      else{
        this.results_none = false;
      }
    });
    

     }

     setProfile(){
      this.user$.subscribe((data) => {
        // console.log(data);
        this.user = data;
      });
    }

     ObjectSize(obj) {
      var size = 0, key;
      for (key in obj) {
          if (obj.hasOwnProperty(key)) size++;
      }
      return size;
      };

  ngOnInit(): void {
    
    this.setProfile();
    // this.user = this.authService.getUser();
    this.cartItemCount = this.cartService.getCartItemCount();
    this.totalPrice = this.cartService.getTotal();
    this.totalWeight = this.cartService.getTotalWeight();
    this.productPrice = this.cartService.getProductPrice();
    this.totalDelivery = this.cartService.getTotalDevilery();
    this.dataService.getAddress().subscribe((data)=>{
      if(data != null){
        this.address = data;
      }
      else{
        this.address = 'Адрес Доставки';
      }
    })
    this.dataService.getStore().subscribe((data)=>{
      if(data != null){
        this.selectedStore = data;
        this.store_title = this.selectedStore.title +' '+ this.selectedStore.address;
      }
    })
    this.getPhoneConfigs();
  }

  openStoreModal() {
    if(this.selectedStore){
      this.modalService.open(SelectStoreComponent,{backdrop:false,size: 'sm'});
    }
    else{
      this.router.navigate(['/']);
    }
  }

  openAuthModal() {
    this.modalService.open(AuthControllerComponent,{
      size: 'sm'
    });
  }

  getPhoneConfigs(){
    this.dataService.getPhoneConfigs().subscribe((data)=>{
      this.phones = data;
      this.activePhone = this.phones[0].value;
    })
  }
 
  selectPhone(phone){
    this.activePhone = phone.value;
  }

  selectLang(lang){
    this.activeLang = lang;
    this.translate.use(lang.value);
    this.dataService.setSessionLanguage(lang);
  }
  getOrders(){
    this.dataService.getOrders().subscribe((data)=>{
    });
  }
  onFocus(){
    this.focus = true;
    this.blur = false;
  }
  onBlur(){
    setTimeout(() => {
      this.blur = true;
      this.focus = false;  
    }, 200);
    
  }
}
