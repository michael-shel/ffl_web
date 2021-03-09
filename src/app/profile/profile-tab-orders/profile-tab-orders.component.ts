import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { EnvService } from '../../services/env.service'
@Component({
  selector: 'app-profile-tab-orders',
  templateUrl: './profile-tab-orders.component.html',
  styleUrls: ['./profile-tab-orders.component.css']
})
export class ProfileTabOrdersComponent implements OnInit {
  constructor(private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private envService: EnvService,
    ) {
    this.url = this.envService.URL;
     }
  orders:any;
  user;
  url;
  faChevronUp = faChevronUp;
  faChevronDown = faChevronDown;

  orderToggle(order){
    this.orders.forEach(element => {
      if (element.id == order.id) {
        element.isOpen = !element.isOpen
      }
    });
  }

  goToProduct(){
    
    this.router.navigate(['/product']);
    setTimeout(() => {
      location.reload();
    }, 100);
    
  }

  

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.dataService.getUserOrders(this.user.id).subscribe((data)=>{
      this.orders = data;
      console.log(this.orders)
    })
  }


}
