import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap,map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnvService } from './env.service';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private selectedStore = new BehaviorSubject({});
  private deliveryAddress = new BehaviorSubject({});
  private selectedBrand = new BehaviorSubject({});

  private cartComment = '';

  constructor(
    private http: HttpClient,
    private env: EnvService,
    private local: LocalStorageService, private session: SessionStorageService
  ) {
    var store = this.local.get('selectedStore');
    var brand = this.local.get('selectedBrand');
    var address = this.local.get('deliveryAddress');
    var comment = this.local.get('cartComment');
    if(comment){
      this.cartComment = comment;
    }
    if(store){
      this.selectedStore.next(store);
    }
    if(brand){
      this.selectedBrand.next(brand);
    }
    if(address){
      this.deliveryAddress.next(address);
    }
    this.local.set('token',null);
  }

  public setComment(comment){
    this.cartComment = comment;
    this.local.set('cartComment', comment);
  }

  public getComment(){
    return this.cartComment;
  }

  public setPaginator(page){
    this.session.set('paginator', page);
  }
  setSessionLanguage(lang){
    this.session.set('language', lang);
  }
  getSessionLanguage(){
    if(this.session.get('language')){
      return this.session.get('language');
    }
    else{
      var lang = {
        title: 'укр',
        value: 'ua'
      };
      return lang;
    }
  }
  setSessionCatalog(page,sort,items,min,max){
    this.session.set('page', page);
    this.session.set('sort', sort);
    this.session.set('items', items);
    this.session.set('min', min);
    this.session.set('max', max);
  }
  getSessionCatalog(){
    var sessionCatalog =  {
      page: this.session.get('page'),
      sort: this.session.get('sort'),
      items: this.session.get('items'),
      min: this.session.get('min'),
      max: this.session.get('max'),
    }
    console.log(sessionCatalog)
    return sessionCatalog;
  }
  public getPaginator(){
    console.log(this.session.get('paginator'));
    return this.session.get('paginator');

  }
  public setCartStore(store) {
    this.selectedStore.next(store);
    this.local.set('selectedStore', store);
  }
  public restorePaginator(){
    this.session.set('page', 1);
  }
  public setStore(brand,store,address) {
    this.selectedStore.next(store);
    this.selectedBrand.next(brand);
    this.deliveryAddress.next(address);

    this.local.set('selectedStore', store);
    this.local.set('selectedBrand', brand);
    this.local.set('deliveryAddress', address);

        console.log(this.selectedStore);
        console.log(this.selectedBrand);
        console.log(this.deliveryAddress);
  }
  public getStore(){

    this.selectedStore.next(this.local.get('selectedStore'));
    return this.selectedStore;

  }
  public getOrders(){

      const headers = new HttpHeaders({
        'Authorization': 'Bearer 00000045A8Q4Hv4w5LRo35786f0gkZqyjSLFYyhC'
      });

      return this.http.get(
        'https://api.ipost.life/public/v1/orders',
        {headers: headers}
        ).pipe(
        tap(data => {
          console.log(data)
        }),
      );
  }
  public getUserOrders(id){
    return this.http.get<any>(this.env.API_URL + 'get_user_orders/'+id)
  }
  public getAddress(){

      this.deliveryAddress.next(this.local.get('deliveryAddress'));

    return this.deliveryAddress;
  }

  public getBrand(){

    this.selectedBrand.next(this.local.get('selectedBrand'));

  return this.selectedBrand;
  }

  public getAllProducts(page,category_id,items,sort,direction,min,max){
    var products:any;
    this.selectedStore.subscribe((data)=>{
      if(data != null){
        var store = data;

        products = this.http.get<any>(this.env.API_URL + 'get_all_products/'+store['id']+'?page='+page+'&category_id='+category_id+'&items='+items+'&sort='+sort+'&direction='+direction+'&min='+min+'&max='+max)
      }
    })
    return products;

  }

  public getSimilar(product_id){
    var products:any;
    this.selectedStore.subscribe((data)=>{
      if(data != null){
        var store = data;
        products = this.http.get<any>(this.env.API_URL + 'get_similar/'+product_id+'/'+store['id'])
      }
    })
    return products;
  }

  public getBanerProducts(page){
    var products:any;
    this.selectedStore.subscribe((data)=>{
      if(data != null){
        var store = data;
        products = this.http.get<any>(this.env.API_URL + 'get_baner_products/'+store['id']+'?page='+page);
      }
    })
    return products;

  }



  getBrandWithStores(){
    return this.http.get<any>(this.env.API_URL + 'brands')
  }

  public getStores() {
    return this.http.get<any>(this.env.API_URL + 'stores')
  }

  public getPosters() {
    return this.http.get<any>(this.env.API_URL + 'posters')
  }

  public getCategoriesWithChild() {
    return this.http.get<any>(this.env.API_URL + 'categories_with_childs')
  }

  public getCategoryWithChild(id) {
    return this.http.get<any>(this.env.API_URL + 'category_with_childs/'+id)
  }


  public getPhoneConfigs() {
    return this.http.get<any>(this.env.API_URL + 'phone_configs')
  }

  public getEmailConfigs() {
    return this.http.get<any>(this.env.API_URL + 'email_configs')
  }

  public getStoreWithCategories(id){
    return this.http.get<any>(this.env.API_URL + 'stores/'+id)
  }
  public getPages() {
    return this.http.get<any>(this.env.API_URL + 'pages')
  }
  public getPage(id) {
    return this.http.get<any>(this.env.API_URL + 'pages/'+id)
  }
  public getUserAddress(id) {
    return this.http.get<any>(this.env.API_URL + 'get_addresses/'+id)
  }
  public getProduct(id) {
    return this.http.get<any>(this.env.API_URL + 'get_product/'+id)
  }
  public getProducts(category_id) {
    var products:any;
    this.selectedStore.subscribe((data)=>{
      if(data != null){
        var store = data;
        products = this.http.get<any>(this.env.API_URL + 'get_products/'+category_id+'/'+store['id'])
      }
    })
    return products;
  }

  public createCart(codes) {
    return this.http.get<any>(this.env.API_URL + 'create_cart?codes=' + codes)
  }

}
