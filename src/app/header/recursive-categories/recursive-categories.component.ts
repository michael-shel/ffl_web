import { Component, Input, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { EnvService } from '../../services/env.service';
import { of, from } from 'rxjs';
import { reduce } from 'rxjs/operators';
import { arrayToTree } from 'performant-array-to-tree'
import { Router } from '@angular/router';
import { TranslateService,LangChangeEvent } from '@ngx-translate/core';
import { translate } from '@angular/localize/src/utils';
@Component({
  selector: 'app-recursive-categories',
  templateUrl: './recursive-categories.component.html',
  styleUrls: ['./recursive-categories.component.css']
})
export class RecursiveCategoriesComponent implements OnInit {

  constructor( 
    private dataService: DataService,
    private env: EnvService,
    private router: Router, 
    public translate: TranslateService
    ) {
    //   translate.onLangChange.subscribe(lang=>{
    //     this.lang = lang;
    // })
      this.lang = this.dataService.getSessionLanguage().value;
     }

  categories:any = [];
  domain = this.env.URL;
  selectedStore;
  lang ;
  ngOnInit(): void {
    console.log(this.lang);
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
          this.lang = event.lang
      });
    // this.getCategoriesWithChild();
    this.dataService.getStore().subscribe((data)=>{
      if (data) {
        this.getStoreWithCategories(data['id']);
      }
    })
    this.dataService.getStore().subscribe((data)=>{
      if(data != null){
        this.selectedStore = data;
      }
    })
    
  }

  // getCategoriesWithChild(){
  //   this.dataService.getCategoriesWithChild().subscribe((data)=>{
  //     this.categories = data.data;
  //   })
  // }
  goToCategory(id){
    this.dataService.restorePaginator();
    setTimeout(() => {
      this.router.navigate(['catalog/',id]);  
    }, 50);
    
  }

  mainCategory(){
    this.dataService.restorePaginator();
    setTimeout(() => {
      this.router.navigate(['catalog/0']);  
    }, 50);
  }
  getStoreWithCategories(id){
    this.dataService.getStoreWithCategories(id).subscribe((data)=>{
      this.categories = [];
      this.categories = data.data.store_categories_categories;

      this.categories.forEach(element => {
        element.parentId = element.perent_category_id;
      });


      this.categories = arrayToTree(this.categories);

      
      // console.log(this.categories)

    })

  
  }


}
