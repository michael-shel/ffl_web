import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainComponent } from './main/main.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { from } from 'rxjs';
import { CatalogComponent } from './catalog/catalog.component';
import { ProfileComponent } from './profile/profile.component';
import { CartComponent } from './cart/cart.component';
import { ProductComponent } from './product/product.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ProfileTabSettingsComponent } from './profile/profile-tab-settings/profile-tab-settings.component';
import { ProfileTabOrdersComponent } from './profile/profile-tab-orders/profile-tab-orders.component';
import { ProfileTabAddressComponent } from './profile/profile-tab-address/profile-tab-address.component';
import { RecursiveCategoriesComponent } from './header/recursive-categories/recursive-categories.component';
import { PageComponent } from './page/page.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// Import library module
import { NgxSpinnerModule } from "ngx-spinner";
import { SelectStoreComponent } from './select-store/select-store.component';
import { RecomendedBanerComponent } from './recomended-baner/recomended-baner.component';
import {IvyCarouselModule} from 'angular-responsive-carousel';
import { AuthControllerComponent } from './auth-controller/auth-controller.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { OrderComponent } from './order/order.component'
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InlineSVGModule } from 'ng-inline-svg';
import {NgxPaginationModule} from 'ngx-pagination';
import { ModalAddAddressComponent } from './modal-add-address/modal-add-address.component';
import { ModalReplaceProductComponent } from './modal-replace-product/modal-replace-product.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    CatalogComponent,
    ProfileComponent,
    CartComponent,
    ProductComponent,
    ProfileTabSettingsComponent,
    ProfileTabOrdersComponent,
    ProfileTabAddressComponent,
    RecursiveCategoriesComponent,
    PageComponent,
    SelectStoreComponent,
    RecomendedBanerComponent,
    AuthControllerComponent,
    OrderComponent,
    ModalAddAddressComponent,
    ModalReplaceProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    NgbModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatButtonToggleModule,
    CarouselModule,
    MatTabsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgxSpinnerModule,
    IvyCarouselModule,
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    InlineSVGModule,
    AngularSvgIconModule.forRoot(),
    NgxPaginationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  
  bootstrap: [AppComponent]
})
export class AppModule { }

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}