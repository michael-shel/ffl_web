import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'https://foodforlife.com.ua/api/v1/';
  URL = 'https://foodforlife.com.ua';
  constructor() { }
}
