import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service'
import { Router } from '@angular/router';
@Component({
  selector: 'app-auth-controller',
  templateUrl: './auth-controller.component.html',
  styleUrls: ['./auth-controller.component.css']
})
export class AuthControllerComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public activeModal: NgbActiveModal,
    private authService: AuthService,
    private router: Router,
  ) { }

  phone;
  code_1 = '';
  code_2 = '';
  code_3 = '';
  code_4 = '';
  sms_send = false;
  timer = 60;
  timer_active = false;
  phone_valid = true;
  rules_agree = true;
  agree = true;
  code_valid = true;
  phone_sms;
  bad_logic = false;
  bad_code = false;
  invalid_code = false;
  openAuth(content) {
    this.modalService.open(content, { size: 'sm' , centered: true });
  }

  ngOnInit(): void {
  }

  onInputEntry(id) {
    let newID = id;
    document.getElementById(newID).focus();
  }
  focusFirst(id){
    if (id != 1) {
      var newId = id-1;
      var input = document.getElementById('code_'+newId) as HTMLTextAreaElement;
      if (!input.value) {
        document.getElementById('code_'+newId).focus();
      }
      else{
        this.focusFirst(newId);
      }
      
    }
  }
  toggleRules(){
    this.agree = !this.agree;
  }
  previousInput(id){
    var newId = id-1;
    var input = document.getElementById('code_'+newId) as HTMLTextAreaElement;
    setTimeout(() => {
      document.getElementById('code_'+newId).focus();  
    }, 50);
    
  }
  PhoneFocus(){
    this.phone_valid = true;
  }
  CodeFocus(){
    this.code_valid = true;
    this.bad_code = false;
  }
  sendSms(){
    if (this.phone) {
      if (this.phone.length == 10) {
        if(this.agree){
        this.timer_active = true;
        this.callTimer(this.timer);
        this.phone_sms = this.phone;
          this.authService.register(this.phone_sms).subscribe((data)=>{
            this.sms_send = true;
             console.log(data);
          })
        }
        else{
          this.rules_agree = false
          setTimeout(() => {
            this.rules_agree = true
          }, 1000);
        }
      }
      else{
        this.phone_valid = false;
      }
    }
    else{
      this.phone_valid = false;
    }
    
  }
  callTimer(timer_active){
    setTimeout(() => {
      this.timer--;
      if (this.timer != 1) {
        this.callTimer(this.timer_active)
      }
      else{
        this.timer = 60;
        this.timer_active = false;
      }
    }, 1000);
  }
  auth(){

    if(this.sms_send){
      
      if(this.code_4 != ''){
      var code = this.code_1+this.code_2+this.code_3+this.code_4;
      // console.log(code);
        this.authService.login(this.phone_sms, code).subscribe(
          data => {
            // console.log(data);
            this.activeModal.close();
            this.router.navigate(['/account']);
            
          },
          error => {
            this.bad_code = true;
            this.invalid_code = true;
            setTimeout(() => {
              this.invalid_code = false;
            }, 1000);
          }
          );

      }
      else{
        this.code_valid = false;
      }
    }
    else{
      this.bad_logic = true;
      setTimeout(() => {
        this.bad_logic = false;
      }, 1000);
    }
  }

}
