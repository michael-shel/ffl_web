import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, SessionStorageService, LocalStorage, SessionStorage } from 'angular-web-storage';
import { tap, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnvService } from './env.service';
import { User } from './user';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  token: string;
  user: User;

  user$ = new BehaviorSubject<User | null>(null);
  watchUser(): Observable<User | null> { return this.user$; }
  peekUser(): User | null { return this.user$.value; }
  pokeUser(user: User): void { this.user$.next(user); }


  constructor(
    private storage: LocalStorageService,
    private http: HttpClient,
    private env: EnvService,
  ) {
    var user = this.storage.get('user');
    if (user) {
      this.pokeUser(user)
    }
    var token = this.storage.get('user_token');
    if (token) {
      this.token = token;
    }
  }



  login(phone: String, password: String) {
    return this.http.post(this.env.API_URL + 'login',
      { phone: phone, password: password }
    ).pipe(
      tap(data => {

        this.storage.set('user_token', data['token']);
        this.storage.set('user', data['user']);
        this.pokeUser(data['user']);

      }),
    )
  }



  register(phone: String) {
    return this.http.post(this.env.API_URL + 'register',
      { phone: phone })
  }

  sendCode(phone: String) {
    return this.http.post(this.env.API_URL + 'send_code',
      { phone: phone })
  }

  getUser() {
    return this.storage.get('user');
  }

  async storageUser(data) {
    await this.storage.set('user', data);
    this.pokeUser(data);
  }

  signup(phone: String) {
    return this.http.post(this.env.API_URL + 'register',
      { phone: phone }

    );
  }

  updateUser(user, id) {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + this.token["token"]
    });

    return this.http.post(
      this.env.API_URL + 'update_user/' + id,
      {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
      },
      { headers: headers }
    ).pipe(
      tap(data => {
        this.storageUser(data);

      }),
    );
  }

  updateSms(id) {
    var token = this.storage.get('user_token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + token
    });

    return this.http.post(
      this.env.API_URL + 'update_sms/' + id,
      { headers: headers }
    ).pipe(
      tap(data => {
      }),
    );
  }

  updatePhone(user, id) {
    var token = this.storage.get('user_token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + token
    });

    return this.http.post(
      this.env.API_URL + 'check_code/' + id,
      {
        phone: user.phone,
        code: user.code,
      },
      { headers: headers }
    ).pipe(
      tap(data => {
        this.storageUser(data);
      }),
    );
  }
  updateAddress(address, id) {
    var token = this.storage.get('user_token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + token
    });

    return this.http.post(
      this.env.API_URL + 'update_address/' + id,
      {
        street: address.street,
        house: address.house,
        floor: address.floor,
        entrance: address.entrance,
        apartment: address.apartment,
        intercom_code: address.intercom_code,
      },
      { headers: headers }
    ).pipe(
      tap(data => {
        console.log(data);
      }),
    );
  }

  deleteAddress(id) {
    var token = this.storage.get('user_token');
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + token
    });

    return this.http.post(
      this.env.API_URL + 'delete_address/' + id,
      { headers: headers }
    ).pipe(
      tap(data => {
        console.log(data);
      }),
    );
  }

  addAddress(address) {
    var token = this.storage.get('user_token')
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + token
    });

    return this.http.post(
      this.env.API_URL + 'addresses',
      {
        street: address.street,
        house: address.house,
        floor: address.floor,
        entrance: address.entrance,
        apartment: address.apartment,
        intercom_code: address.intercom_code,
        author_id: address.author_id,
        title: address.title
      },
      { headers: headers }
    ).pipe(
      tap(data => {
        console.log(data);
      }),
    );
  }

  updateProfile(user, id) {
    this.token = this.storage.get('user_token');
    console.log(this.token);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + this.token
    });

    return this.http.post(
      this.env.API_URL + 'update_profile/' + id,
      {
        name: user.name,
        surname: user.surname,
        parent_name: user.parent_name,
        birthday: user.birthday,
        email: user.email,
        main_address: user.main_address
      },
      { headers: headers }
    ).pipe(
      tap(data => {
        this.storageUser(data);

      }),
    );
  }


  updateOrders(order, product) {
    this.token = this.storage.get('user_token');
    console.log(this.token);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + this.token
    });

    return this.http.post(
      this.env.API_URL + 'update_orders/',
      {
        'id': product.product_id,
        'orders': order,
      },
      { headers: headers }
    ).pipe(
      tap(data => {

      }),
    );
  }

  getUserOreders(id) {

  }
  createOrder(order) {
    this.token = this.storage.get('user_token');
    console.log(this.token);
    const headers = new HttpHeaders({
      'Authorization': 'Bearer' + ' ' + this.token
    });

    return this.http.post(
      this.env.API_URL + 'order_create',
      {
        title: order.title,
        status: 0,
        comment: order.comment,
        product_price: order.product_price,
        delivery: order.delivery,
        product_weight: order.product_weight,
        address: order.address,
        paymant: order.paymant,
        author_id: order.author_id,
        total_price: order.total_price
      },
      { headers: headers }
    ).pipe(
      tap(data => {
        console.log(data);
      }),
    );
  }

  logout() {
    this.storage.remove('user');
    this.storage.remove('user_token');
    this.pokeUser(null);
    this.token = '';
  }

}
