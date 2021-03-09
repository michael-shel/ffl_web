import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { CartService } from '../services/cart.service';
import { User } from '../services/user';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvService } from '../services/env.service';
@Component({
  selector: 'app-modal-replace-product',
  templateUrl: './modal-replace-product.component.html',
  styleUrls: ['./modal-replace-product.component.css']
})
export class ModalReplaceProductComponent implements OnInit {
  
  @Input() public product;

  similar = [];
  products = [];
  url = this.env.URL;
  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private cartService: CartService,
    private env: EnvService
  ) { }

  ngOnInit(): void {
    this.dataService.getSimilar(this.product.id).subscribe((data)=>{
      
      this.similar = data;
      this.setSimilar();

    });
  }

  setSimilar(){
    this.similar.forEach(product => {
      if(Number(product.special_price) != 0){
        if(Number(product.special_price) < Number(product.price)){
          product.sale = 100-Math.round(product.special_price*100/product.price);
        }
        else{
          product.special_price = product.price
        }
      }

      let weight_set = false;
      product.product.product_meta_data.forEach(meta => {
        if(meta.title == 'Вага'){
          product.weight = meta.value;
          product.weight_type = meta.type;
          weight_set = true;
        }
      });
      if(!weight_set){
        product.weight = 0;
        product.weight_type = '';
      }
      
      this.products.push(product);
    });
  }
  goToProduct(product){
    
    this.router.navigate(['/product',product.id]);
    
  }

  replace(product){
    this.cartService.decreaseProduct(this.product);
    this.cartService.addProduct(product);
    // this.passProduct.emit(product);
    this.activeModal.close();
  }
}
