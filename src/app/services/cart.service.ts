import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnvService } from './env.service';
import { DataService } from './data.service';
import { AuthService } from './auth.service';

export interface Product {
  id: number;
  title: string;
  price: number;
  special_price: number;
  amount: number;
  code: number;
  weight: number;
  weight_type: string;
  qty: number;
  product_id: number;
}
export interface Store {
  id: number;
  title: string;
  address: string;
}
@Injectable({
  providedIn: 'root'
})
export class CartService {
  data: Product[] = [
  ];
  store: Store[] = [
  ];



  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
  private totalPrice = new BehaviorSubject(0);
  private totalDevilery = new BehaviorSubject(0);
  private productPrice = new BehaviorSubject(0);
  private totalWeight = new BehaviorSubject(0);
  private storeSelected = null;

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private dataService: DataService,
    private authService: AuthService,
    private storage: LocalStorageService,
  ) {

    if (this.storage.get('cart')) {
      this.cart = this.storage.get('cart');
    }


    if (this.storage.get('cartItemCount')) {
      this.cartItemCount.next(this.storage.get('cartItemCount'));
    }

    if (this.storage.get('totalPrice')) {
      this.totalPrice.next(this.storage.get('totalPrice'));
    }

    if (this.storage.get('totalWeight')) {
      this.totalWeight.next(this.storage.get('totalWeight'));
    }
    if (this.storage.get('totalDevilery')) {
      this.totalDevilery.next(this.storage.get('totalDevilery'));
    }
    if (this.storage.get('productPrice')) {
      this.productPrice.next(this.storage.get('productPrice'));
    }

  }

  public storegaCart() {

  }
  public getStore() {
    return this.storeSelected;
  }

  public getStores() {
    return this.http.get<any>(this.env.API_URL + 'stores')
  }

  public getProducts() {
    return this.data;
  }

  public getCart() {
    return this.cart;
  }

  public getCartItemCount() {
    return this.cartItemCount;
  }

  public clearCart() {
    this.cart = [];
    this.cartItemCount.next(0);
    this.totalWeight.next(0);
    this.productPrice.next(0);
    this.totalDevilery.next(0);
    this.totalPrice.next(0);

    this.storage.set('cart', this.cart);
    this.storage.set('cartItemCount', 0);
    this.storage.set('totalWeight', 0);
    this.storage.set('productPrice', 0);
    this.storage.set('totalDevilery', 0);
    this.storage.set('totalPrice', 0);
  }

  public inCart(product) {
    for (let p of this.cart) {
      if (p.id === product.id) {
        return p.amount;
      }
    }
    return 0;
  }

  public addProduct(product) {
    let added = false;
    for (let p of this.cart) {
      if (p.id === product.id) {
        p.amount += 1;
        added = true;
        break;
      }
    }
    if (!added) {
      if (!product.amount) {
        product.amount = 1;
      }
      this.cart.push(product);
    }

    this.cartItemCount.next(this.cartItemCount.value + 1);
    this.storage.set('cartItemCount', this.cartItemCount.value);
    this.totalWeight.next((this.cart.reduce((i, j) => i + j.weight * j.amount, 0)).toFixed(2));
    this.storage.set('totalWeight', this.totalWeight.value);
    this.productPrice.next((this.cart.reduce((i, j) => i + (j.qty != 0 ? j.special_price : 0) * j.amount, 0)).toFixed(2));
    this.storage.set('productPrice', this.productPrice.value);

    this.totalDevilery.next(0);
    this.storage.set('totalDevilery', this.totalDevilery.value);
    var product_price = parseFloat(this.storage.get('productPrice'));
    if (!product_price) {
      product_price = 0
    }

    var total_price = parseFloat(product_price.toFixed(2));
    if (!total_price) {
      total_price = 0;
    }
    this.totalPrice.next(total_price);
    this.storage.set('totalPrice', this.totalPrice.value);
    this.storage.set('cart', this.cart);

  }

  public decreaseProduct(product) {
    this.cart.forEach((p, index) => {
      if (p.id === product.id) {
        p.amount -= 1;
        if (p.amount == 0) {
          this.cart.splice(index, 1);
        }
      }
    });

    this.cartItemCount.next(this.cartItemCount.value - 1);
    this.storage.set('cartItemCount', this.cartItemCount.value);
    this.totalWeight.next((this.cart.reduce((i, j) => i + j.weight * j.amount, 0)).toFixed(2));
    this.storage.set('totalWeight', this.totalWeight.value);
    this.productPrice.next((this.cart.reduce((i, j) => i + (j.qty != 0 ? j.special_price : 0) * j.amount, 0)).toFixed(2));
    this.storage.set('productPrice', this.productPrice.value);

    this.totalDevilery.next(0);
    this.storage.set('totalDevilery', this.totalDevilery.value);
    var product_price = parseFloat(this.storage.get('productPrice'));
    if (!product_price) {
      product_price = 0
    }

    var total_price = parseFloat(product_price.toFixed(2));
    if (!total_price) {
      total_price = 0;
    }
    this.totalPrice.next(total_price);
    this.storage.set('totalPrice', this.totalPrice.value);
    this.storage.set('cart', this.cart);

  }

  public removeProduct(product) {
    this.cart.forEach((p, index) => {
      if (p.id === product.id) {
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index, 1);
      }
    })
    this.storage.set('cartItemCount', this.cartItemCount.value);
    this.storage.set('cart', this.cart);
  }
  public setOrder(order_id, product_id) {
    return this.http.get<any>(this.env.API_URL + 'set_order/' + order_id + '/' + product_id)
  }

  public updateOrderProducts(order_id) {
    this.cart.forEach(product => {
      this.authService.updateOrders(order_id, product)
    });

  }



  public getTotal() {
    return this.totalPrice;
  }
  public getTotalWeight() {
    return this.totalWeight;
  }
  public getProductPrice() {
    return this.productPrice;
  }
  public getTotalDevilery() {
    return this.totalDevilery;
  }
}
