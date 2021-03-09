import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { User } from '../services/user';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-modal-add-address',
  templateUrl: './modal-add-address.component.html',
  styleUrls: ['./modal-add-address.component.css']
})
export class ModalAddAddressComponent implements OnInit {
  @Input() public user_id;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
  ) { }

  addressForm;

  ngOnInit(): void {
console.log(this.user_id);
    this.addressForm = this.formBuilder.group({
      main_address: [''],
      title: ['',Validators.required],
      street: ['',Validators.required],
      house: ['',Validators.required],
      floor: [''],
      entrance: [''],
      apartment: [''],
      intercom_code: [''],
    });

  }

  addAddress(){
    var address = {
      'street': this.addressForm.value['street'],
      'house': this.addressForm.value['house'],
      'title': this.addressForm.value['title'],
      'floor': this.addressForm.value['floor'],
      'entrance': this.addressForm.value['entrance'],
      'apartment': this.addressForm.value['apartment'],
      'intercom_code': this.addressForm.value['intercom_code'],
      'author_id': this.user_id
    }
    console.log(address);
    this.authService.addAddress(address).subscribe(
      data => {
        if (this.addressForm.value['main_address']) {
          this.updateMain(data['data'].id);
          setTimeout(() => {
            this.activeModal.close('success');
          }, 100);
        }
        else{
          setTimeout(() => {
            this.activeModal.close('success');
          }, 100);
        }
        
        
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

  updateMain(id){
    var user = {
      'main_address': id
    }
    this.authService.updateProfile(user,this.user_id).subscribe(
      data => {
        console.log(data);
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
