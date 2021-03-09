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
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-recomended-baner',
  templateUrl: './recomended-baner.component.html',
  styleUrls: ['./recomended-baner.component.css'],
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
export class RecomendedBanerComponent implements OnInit {

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
       items: 1
     },
      940: {
       items: 1
     }
    },
   nav: false,
   slideBy:'page'
  }
  url;
  lang;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

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
    this.url = this.env.URL;
    this.getBanerProducts();
    this.lang = this.dataService.getSessionLanguage().value;
  }

  products_slider = [
  ];

  id:any;
  cart = [];
  products_cart = [];
  cartItemCount: BehaviorSubject<number>;
  wishlistItemCount: BehaviorSubject<number>;
  totalPrice: BehaviorSubject<number>;
  page:number;
  recipeItemCount: BehaviorSubject<number>;
  totalCounter = new BehaviorSubject(0);
  wishlist_subscribe = new BehaviorSubject([]);
  storeId:any;

  selectedStore: BehaviorSubject<object>;
  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang
  });
      this.products_cart = this.cartService.getProducts();
      this.cart = this.cartService.getCart();
      this.cartItemCount = this.cartService.getCartItemCount();
      

  }


  getBanerProducts(){

    for (let index = 1; index < 4; index++) {
      
      this.dataService.getBanerProducts(index).subscribe((data)=>{
        // console.log(data);
        if (data.data) {
          var slide = [];
          
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
            
            slide.push(product);  
          });
          this.products_slider.push(slide);
        }
      })
    }
    // console.log(this.products_slider);
    
    // this.products_slider = this.products_slider.filter(slide => slide.length > 0);
    // console.log(this.products_slider);
   
  }

  toggle(product) {
    product.isOpen = !product.isOpen;
  }


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
