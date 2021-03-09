import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.css']
})
export class PageComponent implements OnInit {

  constructor(
    private activateRoute: ActivatedRoute,
    private dataService: DataService,
    private spinner: NgxSpinnerService
  ) { }
  id: any;
  page: any;
  ngOnInit(): void {
    // this.activateRoute.params.subscribe(params => {
    //   this.spinner.show();
    //   window.scrollTo(0, 0);
    //     setTimeout(() => {
    //       this.spinner.hide();
    //     }, 200);
    //  });

    this.activateRoute.params.subscribe(params => {
      this.id = params['id'];
      this.getPage(this.id);
   });


  }


  getPage(id){
    this.dataService.getPage(id).subscribe((data)=>{
      this.page = data.data;
    })
  }

}
