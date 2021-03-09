import { Component, OnInit } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { Router } from '@angular/router';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service'
import { BehaviorSubject } from 'rxjs';
import { EnvService } from '../services/env.service'
import { element } from 'protractor';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

interface PerPage{
  title:string;
  value:number;
  active:boolean;
}
interface Sort{
  title:string;
  value:string;
  direction:string;
  active:boolean,
  title_ru:string,
  title_en:string
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('visible', style({
        opacity: '1',
        transform: 'translateY(0px)'
      })),
      state('hidden', style({
        transform: 'translateY(-10px)',
        opacity: '0',
      })),
      transition('visible => hidden', [
        animate('0.3s')
      ]),
      transition('hidden => visible', [
        animate('0.3s')
      ]),
    ]),
    trigger('togglePriceBox', [
      // ...
      state('visible', style({
        opacity: '1',
        transform: 'translateY(0px)'
      })),
      state('hidden', style({
        transform: 'translateY(-10px)',
        opacity: '0',
      })),
      transition('visible => hidden', [
        animate('0.3s')
      ]),
      transition('hidden => visible', [
        animate('0.3s')
      ]),
    ])
  ]
})
export class CatalogComponent implements OnInit {

  lang ;
  categoryToggle = true;
  priceToggle = true;

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  customOptions2: OwlOptions = {
    loop: true,
    margin: 10,
    autoplay:true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 800,
    autoplayTimeout: 10000,
    navText: [ '<i class="fas fa-chevron-left"></i>', '<i class="fas fa-chevron-right"></i>' ],
    responsive: {
      0: {
       items: 1
     },
      480: {
       items: 2
     },
      940: {
       items: 3
     }
    },
   nav: false,
   slideBy:'page'
  }

  faTimes = faTimes;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  faTrash = faTrash;
  constructor( 
    private route: Router,
    private activateRoute: ActivatedRoute,
    private dataService: DataService,
    private cartService: CartService,
    private env: EnvService,
    public translate: TranslateService
    ) {
      this.lang = this.dataService.getSessionLanguage().value;
     }
  min = null;
  max = null;
  collectionSize = 0;
  // isOpen = true;
  url = this.env.URL;

  count = 0;



  id:any;

  
  perPage : PerPage[] = [
    {title: '3', value: 3, active: true},
    {title: '6', value: 6, active: false},
    {title: '90', value: 90, active: false},
    {title: '120', value: 120, active: false}
  ]
  selectedPerPage = this.perPage[0];
  
  sorts: Sort[] = [
    {title: 'Рекомендовані',title_ru: 'Рекомендованые',title_en: 'Recommend', value: 'recommend', direction: 'DESC',active: true},
    {title: 'Популярні',title_ru: 'Популярые',title_en: 'Popular', value: 'recommend', direction: 'ASC',active: false},
    {title: 'Дешеві',title_ru: 'Дешовые',title_en: 'Cheap', value: 'price', direction: 'ASC',active: false},
    {title: 'Дорогі',title_ru: 'Дорогие',title_en: 'Expensive', value: 'price', direction: 'DESC',active: false},
    {title: 'Акції',title_ru: 'Акции',title_en: 'Sale', value: 'recommend', direction: 'DESC',active: false},
  ]
  selectedSort = this.sorts[0];

  products:any = [
  ];

  
  selectedStore: BehaviorSubject<object>;

  cart = [];
  per_page;
  total;
  products_cart = [];
  cartItemCount: BehaviorSubject<number>;
  wishlistItemCount: BehaviorSubject<number>;
  totalPrice: BehaviorSubject<number>;
  page:number;
  recipeItemCount: BehaviorSubject<number>;
  totalCounter = new BehaviorSubject(0);
  wishlist_subscribe = new BehaviorSubject([]);
  storeId:any;
  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang
  });
    this.min = this.dataService.getSessionCatalog().min?this.dataService.getSessionCatalog().min:this.min;
    this.max = this.dataService.getSessionCatalog().max?this.dataService.getSessionCatalog().max:this.max;
    let item = this.dataService.getSessionCatalog().items;
    if(item){
      this.perPage.forEach(element => {
        if(element.title == item.title){
          element.active = true;
          this.selectedPerPage = element;
        }
      });
    }
    let sort = this.dataService.getSessionCatalog().sort;
    if (sort) {
      this.sorts.forEach(element => {
        if(element.title == sort.title){
          element.active = true;
          this.selectedSort = element;
        }
      });  
    }
    
    // this.selectedPerPage = this.dataService.getSessionCatalog().items?this.dataService.getSessionCatalog().items:this.selectedPerPage;
    // this.selectedSort = this.dataService.getSessionCatalog().sort?this.dataService.getSessionCatalog().sort:this.selectedSort;
    this.page = this.dataService.getSessionCatalog().page?this.dataService.getSessionCatalog().page:this.page;

    this.dataService.getStore().subscribe((data)=>{
      if (data) {
        this.storeId = data['id'];
      }
    

    this.activateRoute.params.subscribe(params => {

      this.products = [];
      this.id = params['id'];
      if(this.id == 0){
        this.getCategoriesWithChild();
      }
      else{
        this.getCategoryWithChild(this.id);
      }
      this.refreshProducts();
      
   });

  })
    this.products_cart = this.cartService.getProducts();
    this.cart = this.cartService.getCart();
    this.cartItemCount = this.cartService.getCartItemCount();

  }
  pageChanged($event){
    this.page = $event;
    this.refreshProducts();
  }
  refreshProducts(){
    // setTimeout(() => {
    //   this.dataService.setPaginator(this.page);
    // }, 100);
    this.products = [];
    let min = 0;
    let max = 99999;
    if(this.min || (this.min < this.max)){
      min = this.min;  
    }
    
    if(this.max || this.max > this.min){
      max = this.max;
    }
    let sort = this.selectedSort.value;
    let direction = this.selectedSort.direction;
    let items = this.selectedPerPage.value;
    let page = this.page;
    this.getAllProducts(page,this.id,items,sort,direction,min,max);

    this.setSessionCatalog(page,this.selectedSort,this.selectedPerPage,this.min,this.max);
  }

  getAllProducts(page,category_id,items,sort,direction,min,max){
    this.dataService.getAllProducts(page,category_id,items,sort,direction,min,max).subscribe((data)=>{
      // console.log(data);
      this.per_page = data.per_page;
      this.total = data.total;
      this.products = [];
      this.collectionSize = data.total;
      data.data.forEach(product => {
        var count = this.cartService.inCart(product);

        if(Number(product.special_price) != 0){
          if(Number(product.special_price) < Number(product.price)){
            product.sale = 100-Math.round(product.special_price*100/product.price);
          }
          else{
            product.special_price = product.price
          }
        }
        
        if (product.product.weight_type == 0){
          product.weight = (Number(product.product.weight)/1000).toFixed(2);  
          product.gram_weight = product.product.weight;
        }
        else{
          product.weight = product.product.weight;
        }
        product.weight_type = product.product.weight_type;
        product.count = count;
        if (count > 0){
          product.isOpen = false;
        }
        else{
          product.isOpen = true;
        }
        
        this.products.push(product);
      });
      console.log(this.products);
    })
    
  }

  setSessionCatalog(page,sort,items,min,max){
    this.dataService.setSessionCatalog(page,sort,items,min,max);
  }
  maxNull(){
    this.max = null;
    this.refreshProducts();
  }
  minNull(){
    this.min = null;
    this.refreshProducts();
  }
  categories: [];
  category_main:any;
  getCategoriesWithChild(){
    this.dataService.getCategoriesWithChild().subscribe((data)=>{
      this.categories = data.data;
      // console.log(this.categories);
      this.filterCategories(this.categories)
    })
  }

  getCategoryWithChild(id){
    this.dataService.getCategoryWithChild(id).subscribe((data)=>{
      if(data.data.perent_category_id != null){
        this.getCategoryWithChild(data.data.perent_category_id);
      }
      else{
      this.categories = data.data.child_categories;
      this.filterCategories(this.categories)
      this.category_main = data.data;
      }
      // console.log(data);
    })
    
  }

  toggle(product) {
    product.isOpen = !product.isOpen;
  }

  // addToCart(product){
  //   console.log('click');
  //   if(product.count == 0){
  //     setTimeout(() => {
  //       this.toggle(product);  
  //     }, 150);
  //   }
  //   product.count++
    
  // }

  rmFromCart(product){
    if(product.count == 1){
      setTimeout(() => {
        this.toggle(product);  
      }, 150);
    }
    
    product.count--
  }

  
  goToProduct(product){
    
    this.route.navigate(['/product',product.id]);
    // setTimeout(() => {
    //   location.reload();
    // }, 100);
    
  }

  addToCart(product) {
    this.cartService.addProduct(product);
    if(product.count == 0){
          setTimeout(() => {
            this.toggle(product);  
        }, 150);
    }
    product.count++;
    // console.log(this.cart);
  }

  decreaseProduct(product) {
    this.cartService.decreaseProduct(product);
    if(product.count == 1){
      setTimeout(() => {
        this.toggle(product);  
      }, 150);
    }
    product.count--

  }

  mainCategory(){
    this.category_main = null;
    this.route.navigate(['/catalog/0']);
  }


  filterCategories(categories){
    categories.forEach(element => {
      var inStore = false
      element.store_categories.forEach(item => {
        if (item.id == this.storeId) {
          inStore = true;
        }
      });
      element.inStore = inStore;
      if(element.child_categories.length > 0){
        this.filterCategories(element.child_categories);
      }
    });
  }

  inStore(store_categories){
    store_categories.forEach(element => {
      if (element.id == this.storeId) {
        return true
      }
      else{
        return false
      }
    });
    
  }
}
