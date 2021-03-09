import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { trigger, state, style, transition, animate, group } from '@angular/animations';
import { Router } from '@angular/router';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faDotCircle } from '@fortawesome/free-regular-svg-icons';
import { DataService } from '../services/data.service';
import { BehaviorSubject } from 'rxjs';
import { Product, CartService } from './../services/cart.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from '../services/env.service';
import { ModalReplaceProductComponent } from '../modal-replace-product/modal-replace-product.component'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
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
    ])
  ]
})
export class CartComponent implements OnInit {
  isOpen = true;
  url = this.env.URL;
  cart: Product[] = [];
  codes = [];
  codeReqest = '';
  stores = [];
  selectedStore: any;
  selectedBrand: any;
  showCommentField = false;
  totals = [];
  all_carts = [];
  total_inStore = new BehaviorSubject(0);
  lang;
  faTimes = faTimes;
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  faTrash = faTrash;
  faDotCircle = faDotCircle;
  faCircle = faCircle;
  faEdit = faEdit;
  address;
  count = 0;
  total = 0;
  totalProducts;
  comment: any;
  Brandstores;
  not_found = [];


  toggle(product) {
    product.isOpen = !product.isOpen;
  }

  toggleCommentField() {
    this.showCommentField = !this.showCommentField;
  }
  // @Output() passProduct: EventEmitter<any> = new EventEmitter();
  replaceProductModal(product) {
    const modalRef = this.modalService.open(ModalReplaceProductComponent, { scrollable: true });
    modalRef.componentInstance.product = product;
    modalRef.result.then((result) => {
      setTimeout(() => {
        location.reload();
      }, 100);
    });
  }
  constructor(private route: Router,
    private cartService: CartService,
    private dataService: DataService,
    private env: EnvService,
    private modalService: NgbModal,
    public translate: TranslateService
  ) {
    this.lang = this.dataService.getSessionLanguage().value;
  }


  ngOnInit(): void {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.lang = event.lang;
    })
    this.setUp();

  }

  setUp() {

    this.dataService.getAddress().subscribe((data) => {
      this.address = data;
    })
    this.dataService.getBrand().subscribe((data) => {
      if (data != null) {
        this.selectBrand(data);
      }
    })

    this.cart = this.cartService.getCart();
    this.totalProducts = this.cart.length;
    // console.log(this.cart)
    this.selectedStore = this.dataService.getStore();
    // console.log(this.selectedStore);
    this.cart.forEach(product => {
      this.codeReqest += product.product_id + ',';
    });
    this.dataService.createCart(this.codeReqest).subscribe((data) => {

      data.forEach(store => {
        const map = new Map();
        let result = [];
        for (let item of store.store_products_avatars) {
          if (!map.has(item.product_id)) {
            map.set(item.product_id, true);
            result.push(item);
          }
        }
        store.products = result;
        this.stores.push(store);
      });
      console.log(this.stores);
      this.setAllCatrs(data);
    });

    this.comment = this.dataService.getComment();
    if (this.comment == '' || this.comment == null) {
      this.commentView = true;
    }
    else {
      this.commentView = false;
      this.showCommentField = true;
    }

    this.totalPrice = this.cartService.getTotal();
    this.totalWeight = this.cartService.getTotalWeight();
    this.productPrice = this.cartService.getProductPrice();
    this.totalDelivery = this.cartService.getTotalDevilery();


  }
  totalPrice: BehaviorSubject<number>;
  totalWeight: BehaviorSubject<number>;
  productPrice: BehaviorSubject<number>;
  totalDelivery: BehaviorSubject<number>;

  commentView: any;
  selectBrand(brand) {
    this.selectedBrand = brand;
    this.Brandstores = brand.brand_stores;
  }

  setAllCatrs(data) {


    var cart = this.cart;
    this.totals = [];
    data.forEach(store => {
      store.products.forEach(function (product) {
        cart.forEach(cart_product => {
          if (cart_product.product_id == product.product_id) {
            product.amount = cart_product.amount;
          }
        });
      });
      var active_store = false;
      if (this.selectedStore.getValue().id == store.id) {
        active_store = true;
      }
      var allProducts = false;
      if (store.products.length >= this.totalProducts) {
        allProducts = true;
      }
      this.totals.push({
        'id': store.id,
        'title_ua': store.title_ua,
        'title_ru': store.title_ru,
        'title_eng': store.title_eng,
        'address': store.address,
        'active': active_store,
        'allProducts': allProducts,
        'value': store.products.reduce((i, j) => i + j.special_price * j.amount, 0).toFixed(2)
      })
    });
    this.all_carts = data;
    // console.log(this.all_carts);
    // console.log(this.totals);
  }


  ResetAllCatrs(data, cart_product) {
    var cart = this.cart;
    this.totals = [];
    data.forEach(store => {

      store.products.forEach(function (product) {
        if (cart_product.product_id == product.product_id) {
          product.amount = cart_product.amount;
        }
      });
      var active_store = false;
      if (this.selectedStore.getValue().id == store.id) {
        active_store = true;
      }
      var allProducts = false;
      if (store.products.length >= this.totalProducts) {
        allProducts = true;
      }
      console.log(store.products.length);
      console.log(this.totalProducts);
      this.totals.push({
        'id': store.id,
        'title': store.title,
        'address': store.address,
        'active': active_store,
        'allProducts': allProducts,
        'value': store.products.reduce((i, j) => i + j.special_price * j.amount, 0).toFixed(2)
      })
    });
    this.all_carts = data;

    console.log(this.totals);
  }

  selectStore(store_id) {
    this.Brandstores.forEach(store => {
      if (store.id == store_id) {
        this.dataService.setCartStore(store);
      }
    });

    this.totals.forEach(element => {
      if (element.id == store_id) {
        element.active = true;
      }
      else {
        element.active = false;
      }
    });

    this.not_found = [];
    this.all_carts.forEach(store => {
      if (store.id == store_id) {
        this.cart.forEach(cart_product => {
          let in_cart = false;
          store.products.forEach(product => {
            if (product.product_id == cart_product.product_id) {
              in_cart = true;
            }
          })

          if (!in_cart) {
            cart_product.price = 0;
            cart_product.special_price = 0;
            cart_product.qty = 0;
            cart_product.amount = 1;
            this.not_found.push(cart_product);
          }
        })
      }
    })

    this.cartService.clearCart();
    this.all_carts.forEach(store => {
      console.log(store);
      if (store.id == store_id) {
        store.products.forEach(product => {


          if (Number(product.special_price) != 0) {
            if (Number(product.special_price) < Number(product.price)) {
              product.sale = 100 - Math.round(product.special_price * 100 / product.price);
            }
            else {
              product.special_price = product.price
            }
          }

          let weight_set = false;
          product.product.product_meta_data.forEach(meta => {
            if (meta.title == 'Вага') {
              product.weight = meta.value;
              product.weight_type = meta.type;
              weight_set = true;
            }
          });
          if (!weight_set) {
            product.weight = 0;
            product.weight_type = '';
          }

          this.cartService.addProduct(product);
        });
        this.not_found.forEach(element => {
          this.cartService.addProduct(element);
        });
      }
    });
    this.cart = this.cartService.getCart();
    setTimeout(() => {
      location.reload();
    }, 1);

  }

  clearComment() {
    this.commentView = true;
    this.comment = '';
    this.showCommentField = false;
    this.dataService.setComment('');
  }
  clearCart() {
    this.cartService.clearCart();
    this.cart = [];
    this.totals = [];
    this.dataService.setComment('');
  }

  toggleComment() {
    this.commentView = !this.commentView;
    this.dataService.setComment(this.comment);
  }

  selectShop(shop) {
    shop.products.array.forEach(product => {
      this.cartService.addProduct(product);
    });
  }

  decreaseCartItem(product) {
    this.cartService.decreaseProduct(product);
    this.ResetAllCatrs(this.stores, product);

    if (this.cart.length == 0) {
      this.dataService.setComment('');
    }
  }

  increaseCartItem(product) {
    this.cartService.addProduct(product);
    this.ResetAllCatrs(this.stores, product)
  }

  removeCartItem(product) {
    this.cartService.removeProduct(product);

    if (this.cart.length == 0) {
      this.dataService.setComment('');
    }
  }

  goToProduct(product) {

    this.route.navigate(['/product', product.id]);

  }

}
