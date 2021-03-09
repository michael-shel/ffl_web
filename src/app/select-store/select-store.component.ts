import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service'
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import { CartService } from './../services/cart.service';
import { EnvService } from '../services/env.service'
@Component({
  selector: 'app-select-store',
  templateUrl: './select-store.component.html',
  styleUrls: ['./select-store.component.css']
})
export class SelectStoreComponent implements OnInit {

  constructor(
    public activeModal: NgbActiveModal,
    private dataService: DataService,
    private router: Router,
    private cartService: CartService,
    private envService: EnvService
    ) { }
    faTimes = faTimes;
    url = this.envService.URL;
    brands = [];
    stores = [];
    selectedBrand;
    selectedStore;
    address;

  ngOnInit(): void {
    this.getBrands();
    this.dataService.getStore().subscribe((data)=>{
      if(data != null){
        this.selectedStore = data;
      }
    })
    
    this.dataService.getBrand().subscribe((data)=>{
      if(data != null){
        this.selectBrand(data);
      }
    })
   
    this.dataService.getAddress().subscribe((data)=>{
      this.address = data;
    })
    
  }

  selectBrand(brand){
    this.selectedBrand = brand;
    this.stores = brand.brand_stores;
    // console.log(this.selectedStore);
    // console.log(this.stores);
  }

  getBrands(){
    this.dataService.getBrandWithStores().subscribe((data)=>{
      this.brands = data.data;
    })
  }

  selectStore(){
    this.dataService.setStore(this.selectedBrand,this.selectedStore,this.address);

    this.cartService.clearCart();
    this.dataService.setComment('');
    this.dataService.restorePaginator();
    this.router.navigate(['/catalog/0']);
    this.activeModal.dismiss('Cross click');

  }
}
