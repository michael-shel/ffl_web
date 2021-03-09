import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { CatalogComponent } from './catalog/catalog.component'
import { ProductComponent } from './product/product.component'
import { CartComponent } from './cart/cart.component'
import { ProfileComponent } from './profile/profile.component'
import { PageComponent } from './page/page.component'
import { OrderComponent } from './order/order.component'
import { AuthGuard } from './guards/auth.guard';
const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'catalog/:id', component: CatalogComponent},
  {path: 'product/:id', component: ProductComponent},
  {path: 'cart', component: CartComponent},
  {path: 'account', component: ProfileComponent,canActivate: [AuthGuard]},
  {path: 'page/:id', component: PageComponent},
  {path: 'order', component: OrderComponent,canActivate: [AuthGuard]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
