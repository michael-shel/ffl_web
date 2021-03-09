import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { SlidesOutputData, OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service'
import { BehaviorSubject } from 'rxjs';
import { EnvService } from '../services/env.service';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('visible', style({
        height: '90%'
      })),
      state('hidden', style({
        height: '400px'
      })),
      transition('hidden => visible', [
        animate('0.3s')
      ]),
      transition('visible => hidden', [
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
export class ProductComponent implements OnInit {

  url = this.env.URL;
  item:any =[];
  product:any =[];
  id: any;
  brew_ru;
  brew_eng;
  faTimes = faTimes;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faTrash = faTrash;
  isOpen = false;
  text = 'Показати більше';
  parent:any;
  customOptions: OwlOptions = {
    loop: true,
    margin: 10,
    autoplay:true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplayTimeout: 8000,
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
   nav: true,
   slideBy:'page'
  }
  composition;
  activeSlides: SlidesOutputData;
  active:any;
  brew = '';
  desc = '';
  galery = [];
  gty = 0;
  youtube_url: SafeResourceUrl;
  height = false;
  lang;

product_data;
  constructor(private activateRoute: ActivatedRoute,
    private dataService: DataService,
    private cartService: CartService,
    private env: EnvService,
    private sanitizer: DomSanitizer,
    public translate: TranslateService) { 



      this.lang = this.dataService.getSessionLanguage().value;
      this.activateRoute.params.subscribe(params => {
        this.id = params['id'];
        this.getProduct(this.id);
     });
    }

  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    })
    this.getProduct(this.id);
  }

  setHeight(){
    setTimeout(() => {
      var desc = document.getElementById('desc') as HTMLTextAreaElement;
      // console.log(desc.clientHeight);
      if(desc.offsetHeight > 400){
        
        this.height = true;
      }  
    }, 150);
    
  }
  getProduct(id){
    this.dataService.getProduct(id).subscribe((data)=>{
      this.product = data.data;
      this.product_data = data.data.product;
      console.log(this.product_data)
      console.log(this.product);
      this.gty = this.product.gty;
      var count = this.cartService.inCart(this.product);

      if (this.product.product.weight_type == 0){
        this.product.weight = (Number(this.product.product.weight)/1000).toFixed(2);  
        this.product.gram_weight = this.product.product.weight;
      }
      else{
        this.product.weight = this.product.product.weight;
      }
      this.product.weight_type = this.product.product.weight_type;
        this.product.count = count;
        if (count > 0){
          this.product.isOpen = false;
        }
        else{
          this.product.isOpen = true;
        }

        if(this.product.product.youtube_url){
          var link = this.product.product.youtube_url.replace('watch?v=', 'embed/');
          var remove_after = link.indexOf('&');
          var result =  link.substring(0, remove_after);
          this.youtube_url = this.sanitizer.bypassSecurityTrustResourceUrl(result);
          // console.log(this.youtube_url)
        }
        else{
          this.youtube_url = null;
        }
      this.parent = this.product.categories[0];
      this.composition = this.product.product.composition;
      this.desc = this.product.product.description;
      this.brew = this.product.product.title;
      this.brew_ru = this.product.product.title_ru;
      this.brew_eng = this.product.product.title_eng;
      this.active = this.product.product.title;
      this.setUpImageGallery(this.product.product.icons);
      this.setHeight();
      
    })
    
  }

  setUpImageGallery(imagedata) {
    this.galery = [];
    imagedata.forEach(element => {
      this.galery.push(element);
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  showToggle(){
    if(this.isOpen == true){
      this.text = 'Показати більше';
    }
    else{
      this.text = 'Сховати'
    };
    this.toggle()
  }


  toggle1(product) {
    product.isOpen = !product.isOpen;
  }

  // addToCart(product){
  //   if(product.count == 0){
  //     setTimeout(() => {
  //       this.toggle1(product);  
  //     }, 150);
  //   }
  //   product.count++
    
  // }

  rmFromCart(product){
    if(product.count == 1){
      setTimeout(() => {
        this.toggle1(product);  
      }, 150);
    }
    
    product.count--
  }
  getPassedData(data: any) {
    this.activeSlides = data.slides[0].id;
    this.active = data.slides[0].id;
    // console.log(this.activeSlides);
  }

  addToCart(product) {
    this.cartService.addProduct(product);
    if(product.count == 0){
          setTimeout(() => {
            this.toggle1(product);  
        }, 150);
    }
    product.count++;
  }

  decreaseProduct(product) {
    this.cartService.decreaseProduct(product);
    if(product.count == 1){
      setTimeout(() => {
        this.toggle1(product);  
      }, 150);
    }
    product.count--

  }
  getData(data: SlidesOutputData) {
    // console.log(data);
  }

}

