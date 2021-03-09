import { Component, ViewChild , Input, OnInit} from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DataService } from '../services/data.service'
import {Router} from '@angular/router';
import { CartService } from './../services/cart.service';
import { EnvService } from './../services/env.service';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { InlineSVGConfig } from 'ng-inline-svg';
import { SVGConfig } from '../svg-config';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [
    trigger('toggleBox', [
      // ...
      state('visible', style({
        opacity: '1'
      })),
      state('hidden', style({
        opacity: '0'
      })),
      transition('hidden => visible', [
        animate('0.3s')
      ]),
    ])
  ],
  providers: [
    { provide: InlineSVGConfig, useClass: SVGConfig }
  ]
})
export class MainComponent implements OnInit {
  @ViewChild('carousel', {static : true}) carousel: NgbCarousel;
  @ViewChild('carousel2', {static : true}) carousel2: NgbCarousel;
  paused = false;
  unpauseOnArrow = false;
  pauseOnIndicator = false;
  showNavigationArrows = true;
  pauseOnHover = true;
  showNavigationIndicators = true;
  url = this.envService.URL;
  isOpen = true;
  isOpen2 = true;
  invalidAddress = false;
  invalidStore = false;
  faTimes = faTimes

  hidden = false;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggle() {
    this.isOpen = !this.isOpen;
    setTimeout(() => {
      this.isOpen = !this.isOpen;
    }, 200);
  }

  toggle2() {
    this.isOpen2 = !this.isOpen2;
    setTimeout(() => {
      this.isOpen2 = !this.isOpen2;
    }, 200);
  }

  togglePaused() {
    if (this.paused) {
      this.carousel.cycle();
    } else {
      this.carousel.pause();
    }
    this.paused = !this.paused;
  }

  togglePaused2() {
    if (this.paused) {
      this.carousel2.cycle();
    } else {
      this.carousel2.pause();
    }
    this.paused = !this.paused;
  }

  onSlide2(slideEvent: NgbSlideEvent) {
    this.toggle2();
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused2();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused2();
    }
  }

  onSlide(slideEvent: NgbSlideEvent) {
    this.toggle();
    if (this.unpauseOnArrow && slideEvent.paused &&
      (slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
      this.togglePaused();
    }
    if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
      this.togglePaused();
    }
  }
  constructor( private dataService: DataService,
    private router: Router,
    private cartService: CartService,
    private envService: EnvService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private iconReg:SvgIconRegistryService ) { }

  brands = [];
  stores = [];
  selectedBrand;
  selectedStore;
  address;
  posters = [];

  ngOnInit(): void {
    this.getBrands();
    this.dataService.getBrand().subscribe((data)=>{
      if(data != null){
        this.selectBrand(data);
      }
    })
    this.dataService.getStore().subscribe((data)=>{
      this.selectedStore = data;
    })
    this.dataService.getAddress().subscribe((data)=>{
      this.address = data;
    })
    this.dataService.getPosters().subscribe((data)=>{
      data.data.forEach(poster => {
        if(poster.active_page == 0){
          this.posters.push(poster);
        }
      });
    })
  }

  registerSvg(brand){
      var link = this.url+'/storage/'+brand.icon.id+'/'+brand.icon.file_name;
      return link
      // return this.domSanitizer.bypassSecurityTrustResourceUrl(this.url+'/storage/'+brand.icon.id+'/'+brand.icon.file_name)
  }
  selectBrand(brand){
    this.stores = brand.brand_stores;
    this.selectedBrand = brand;
    this.selectedStore = null;
  }

  getBrands(){
    this.dataService.getBrandWithStores().subscribe((data)=>{
      this.brands = data.data;
      this.brands.forEach(element => {
        element.svgLink = this.registerSvg(element);
      });
    })
  }
  clickStore(){
    this.invalidStore = false;
  }
  focusAddress(){
    this.invalidAddress = false;
  }
  selectStore(){
    if(this.address){
      if (this.address.length < 8) {
        this.invalidAddress = true
      }
    }
    else{
      this.invalidAddress = true
    }
    if(!this.selectedStore){
      this.invalidStore = true
    }
    if(!this.invalidAddress && !this.invalidStore){
      this.dataService.setStore(this.selectedBrand,this.selectedStore,this.address);
      this.cartService.clearCart();
      this.dataService.setComment('');
      this.dataService.restorePaginator();
      this.router.navigate(['/catalog/0']);
    }
  }
}
