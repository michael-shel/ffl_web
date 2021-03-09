import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service'
import { Router}  from '@angular/router';
import { User } from '../../services/user';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-profile-tab-settings',
  templateUrl: './profile-tab-settings.component.html',
  styleUrls: ['./profile-tab-settings.component.css']
})
export class ProfileTabSettingsComponent implements OnInit {

  user : User;
  user$: Observable<User | null>;
 
  profileForm;
  dateForm;
  emailForm;
  phoneForm;

  constructor(
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
  ) {
    this.user$ = this.authService.watchUser();
    console.log(this.user$);
   }

  ngOnInit(): void {
    
    this.setProfile();

  }

  setProfile(){
    this.user$.subscribe((data) => {
      console.log(data);
      this.user = data;
      this.profileForm = this.formBuilder.group({
         name: this.user.name?this.user.name:'',
         surname:  this.user.surname?this.user.surname:'',
         parent_name:  this.user.parent_name?this.user.parent_name:'',
      });
      
      console.log(this.profileForm)
      this.dateForm = this.formBuilder.group({
        day: this.user.birthday?this.user.birthday.substring(8,10):'',
        month:  this.user.birthday?this.user.birthday.substring(5,7):'',
        year:  this.user.birthday?this.user.birthday.substring(0,4):'',
     });
     this.emailForm = this.formBuilder.group({
        email: this.user.email?this.user.email:'',
     });
     this.phoneForm = this.formBuilder.group({
      phone: this.user.phone?this.user.phone:'',
      code_1: '',
      code_2: '',
      code_3: '',
      code_4: '',
     });


    });
  }
  updateProfile(){
      var user = {
        'name': this.profileForm.value['name'],
        'surname': this.profileForm.value['surname'],
        'parent_name': this.profileForm.value['parent_name'],
      }
      this.authService.updateProfile(user,this.user.id).subscribe(
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

  updateDate(){
    
    var date = new Date(this.dateForm.value['year']+'-'+this.dateForm.value['month']+'-'+this.dateForm.value['day']).toUTCString();
    
    var user = {
      'birthday': date,
    }
    console.log(user);
    this.authService.updateProfile(user,this.user.id).subscribe(
      data => {
        console.log(data);
        // this.router.navigateByUrl('/account');
      },
      error => {
        console.log(error);
        this.setProfile();
      },
      () => {
      }
    );
}

updateEmail(){
  
  var user = {
    'email': this.emailForm.value['email'],
  }
  console.log(user);
  this.authService.updateProfile(user,this.user.id).subscribe(
    data => {
      console.log(data);
      // this.router.navigateByUrl('/account');
    },
    error => {
      console.log(error);
      this.setProfile();
    },
    () => {
    }
  );
}


sendSms(){
  if (this.phoneForm.value['phone']) {
    if (this.phoneForm.value['phone'].length == 10) {
      this.authService.updateSms(this.user.id).subscribe((data)=>{
        console.log(data);
      })
    }
  }
}
updatePhone(){
  if (this.phoneForm.value['phone']) {
    if (this.phoneForm.value['phone'].length == 10) {
    
  var code = this.phoneForm.value['code_1']+this.phoneForm.value['code_2']+this.phoneForm.value['code_3']+this.phoneForm.value['code_4']
    console.log(code);
  var user = {
    'phone': this.phoneForm.value['phone'],
    'code': code,
  }
  this.authService.updatePhone(user,this.user.id).subscribe(
    data => {
      console.log(data);
      // this.router.navigateByUrl('/account');
    },
    error => {
      console.log(error);
      this.setProfile();
    },
    () => {
    }
  );
}
}}

}
