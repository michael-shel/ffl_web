import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { User } from '../../services/user';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalAddAddressComponent } from '../../modal-add-address/modal-add-address.component'
@Component({
  selector: 'app-profile-tab-address',
  templateUrl: './profile-tab-address.component.html',
  styleUrls: ['./profile-tab-address.component.css']
})
export class ProfileTabAddressComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { 
    this.user$ = this.authService.watchUser();
  }
  user: User ;
  user$: Observable<User | null>;
  addresses=[];
  addressForm;

  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;
  activeAddress;
  main_address;
  addressToggle(address){
    this.addresses.forEach(element => {
      if (element.id == address.id) {
        address.isOpen = !address.isOpen
      }
      else{
        element.isOpen = true
      }

        this.activeAddress = address;
        this.addAddress(this.activeAddress);  
      
    });
  }

  setProfile(){
    this.user$.subscribe((data) => {
      // console.log(data);
      this.user = data;
    });
  }

  goToProduct(){
    
    this.router.navigate(['/product']);
    setTimeout(() => {
      location.reload();
    }, 100);
    
  }

  changeMain(main_address){
    this.main_address = main_address;
  }

  ngOnInit(): void {
    this.setProfile();
    // console.log(this.user);
    this.getUserAddresses(this.user.id);

  }

  getUserAddresses(id){
    this.dataService.getUserAddress(id).subscribe((data)=>{
      // if(data[0].author_addresses.length > 0){
      this.addresses = data[0].author_addresses;
        this.addresses.forEach(element => {
          element.isOpen = false;
          if(this.user.main_address){
            if(element.id == this.user.main_address){
              this.main_address = element.id;
              element.isOpen = true;
              this.activeAddress = element;
 
            }
          }
        });
        if (this.addresses.length > 0) {
        if (!this.activeAddress) {
          
            data[0].author_addresses[0].isOpen = true;
            this.activeAddress = data[0].author_addresses[0];  
          
        }
      // }

          // console.log(this.addresses);
          // console.log(this.activeAddress);
          this.addAddress(this.activeAddress);
        }
    })
  }

  addAddress(element) {
    this.addressForm = this.formBuilder.group({
         street: element.street?element.street:'',
         house: element.house?element.house:'',
         floor: element.floor?element.floor:'',
         entrance: element.entrance?element.entrance:'',
         apartment: element.apartment?element.apartment:'',
         intercom_code: element.intercom_code?element.intercom_code:'',
    });
  }

  saveAddress(){
    this.updateAddress();
    this.updateMain();
  }

  addAddressModal(){
    const modalRef = this.modalService.open(ModalAddAddressComponent);
    modalRef.componentInstance.user_id = this.user.id;
    // modalRef.result.then(() => { console.log('close') }, () => { 
    //   this.getUserAddresses(this.user.id);
    // })
    modalRef.result.then((result) => {
      if ( result === 'success' ) {
          this.getUserAddresses(this.user.id);
      }
    }, (reason) => {
    });
  }

  

  updateAddress(){
    var user = {
      'street': this.addressForm.value['street'],
      'house': this.addressForm.value['house'],
      'name': this.addressForm.value['name'],
      'floor': this.addressForm.value['floor'],
      'entrance': this.addressForm.value['entrance'],
      'apartment': this.addressForm.value['apartment'],
      'intercom_code': this.addressForm.value['intercom_code'],
    }
    this.authService.updateAddress(user,this.activeAddress.id).subscribe(
      data => {
        // console.log(data);
        // this.router.navigateByUrl('/account');
      },
      error => {
        console.log(error);
      },
      () => {
      }
    );
}

  addressDelete(){
    this.authService.deleteAddress(this.activeAddress.id).subscribe((data)=>{
      this.user = this.authService.getUser();
      this.getUserAddresses(this.user.id);
    })
  }
  updateMain(){
    var user = {
      'main_address': this.main_address,
    }
    this.authService.updateProfile(user,this.user.id).subscribe(
      data => {
        // console.log(data);
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
