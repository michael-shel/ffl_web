import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { User } from '../services/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartService } from '../services/cart.service';
import { EnvService } from '../services/env.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
interface Time {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ua-UA'},

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class OrderComponent implements OnInit {

  constructor(
    private _adapter: DateAdapter<any>,
    private formBuilder: FormBuilder,
    private route: Router,
    private cartService: CartService,
    private dataService: DataService,
    private authService: AuthService,
    private env: EnvService,
    ) {

      this.user = this.authService.getUser();
      this.getUserAddresses(this.user.id);
      this.addAddress({});
      this.profileForm = this.formBuilder.group({
        name: this.user.name?this.user.name:'',
        surname:  this.user.surname?this.user.surname:'',
        parent_name:  this.user.parent_name?this.user.parent_name:'',
     });
    }

    formTime: FormGroup;
    formPay: FormGroup;

  user;
  addresses=[];
  addressForm;
  profileForm;
  selectedStore;
  store_title = 'Вибрати магазин';
  cartItemCount: BehaviorSubject<number>;
  totalPrice: BehaviorSubject<number>;
  totalWeight: BehaviorSubject<number>;
  productPrice: BehaviorSubject<number>;
  totalDelivery: BehaviorSubject<number>;

  activeAddress:any = {
    'id':0
  };
  main_address;
  pay_method:any;
  pay_methods:any [] = [
    { 'key': 0,
      'title':'Експрес доставка від 60 хвилин в день доставки' },
    { 'key': 1,
      'title':'Вказати зручний для вас час і дату доставки ' }
  ];

  times: Time[] = [
    {value: '0', viewValue: '08:00 - 10:00'},
    {value: '1', viewValue: '10:00 - 12:00'},
    {value: '2', viewValue: '12:00 - 14:00'},
    {value: '3', viewValue: '14:00 - 15:00'},
    {value: '4', viewValue: '15:00 - 17:00'},
    {value: '5', viewValue: '17:00 - 19:00'},
    {value: '6', viewValue: '19:00 - 20:00'}
  ];

  isSubmitted = false;

  getUserAddresses(id){
    this.dataService.getUserAddress(id).subscribe((data)=>{
      // if(data[0].author_addresses.length > 0){
      this.addresses = data[0].author_addresses;
      // if(data[0].author_addresses.length != 0){
        this.addresses.forEach(element => {
          if(this.user.main_address){
            if(element.id == this.user.main_address){
              this.activeAddress = element;
            }
          }
        });
        if (!this.activeAddress) {
          this.activeAddress = data[0].author_addresses[0];
        }
      // }
      // }
      console.log(this.addresses);
      console.log(this.activeAddress);
      this.addAddress(this.activeAddress);
    })
  }

  addAddress(element) {
    this.addressForm = new FormGroup({

      street: new FormControl(element?element.street?element.street:'':''),
      house: new FormControl(element?element.house?element.house:'':''),
      floor: new FormControl(element?element.floor?element.floor:'':''),
      entrance: new FormControl(element?element.entrance?element.entrance:'':''),
      apartment: new FormControl(element?element.apartment?element.apartment:'':''),
      intercom_code: new FormControl(element?element.intercom_code?element.intercom_code:'':''),

   });
  }

  ngOnInit(): void {

    this.totalPrice = this.cartService.getTotal();
    this.totalWeight = this.cartService.getTotalWeight();
    this.productPrice = this.cartService.getProductPrice();
    this.totalDelivery = this.cartService.getTotalDevilery();
    this.dataService.getStore().subscribe((data)=>{
      if(data != null){
        this.selectedStore = data;
        this.store_title = this.selectedStore.title;
      }
    })
    this.formTime = new FormGroup({
      time: new FormControl('')
    });

    this.formPay = new FormGroup({
      pay: new FormControl('')
    });

      this._adapter.setLocale('ru');

  }

  createOrder(){
    var comment = this.dataService.getComment();
    var address = {
      'street': this.addressForm.value['street'],
      'house': this.addressForm.value['house'],
      'name': this.addressForm.value['name'],
      'floor': this.addressForm.value['floor'],
      'entrance': this.addressForm.value['entrance'],
      'apartment': this.addressForm.value['apartment'],
      'intercom_code': this.addressForm.value['intercom_code'],
      'time': this.formTime['time']
    }
      var order = {
        'title': 'oreder'+Math.floor(Math.random() * 99999),
        'product_price': this.productPrice.getValue(),
        'delivery': this.totalDelivery.getValue(),
        'product_weight': this.totalWeight.getValue(),
        'address': address,
        'comment': comment,
        'paymant': this.formPay.value['pay'],
        'author_id': this.user.id,
        'total_price': this.totalPrice.getValue()
      }
      this.authService.createOrder(order).subscribe(
        data => {
          console.log(data);
          this.cartService.updateOrderProducts(data['id'])
          console.log(data['id'])
          // this.router.navigateByUrl('/account');
        },
        error => {
          console.log(error);
        },
        () => {
        }
      );


  }

}
