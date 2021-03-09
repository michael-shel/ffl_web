import { Component, OnInit } from '@angular/core';
import { faGooglePlay } from '@fortawesome/free-brands-svg-icons';
import { faAppStore } from '@fortawesome/free-brands-svg-icons';
import { DataService } from '../services/data.service'
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  faGooglePlay = faGooglePlay;
  faAppStore = faAppStore;
  
  constructor( private dataService: DataService ) { }

  phones = [];
  emails = [];
  pages = [];

  ngOnInit(): void {
    this.getPhoneConfigs();
    this.getEmailConfigs();
    this.getPages();
  }

  getPhoneConfigs(){
    this.dataService.getPhoneConfigs().subscribe((data)=>{
      this.phones = data;
    })
  }
  getEmailConfigs(){
    this.dataService.getEmailConfigs().subscribe((data)=>{
      this.emails = data;
    })
  }

  getPages(){
    this.dataService.getPages().subscribe((data)=>{
      this.pages = data.data;
    })
  }
}
