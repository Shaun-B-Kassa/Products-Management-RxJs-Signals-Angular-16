import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
  computed,
  inject,
} from '@angular/core';

import { NgIf, NgFor, CurrencyPipe, AsyncPipe } from '@angular/common';
import { Product } from '../product';
import { ProductService } from '../product.service';
import {
  EMPTY,
  Observable,
  Subscription,
  catchError,
  switchMap,
  tap,
} from 'rxjs';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, CurrencyPipe],
})
export class ProductDetailComponent {
  productsService = inject(ProductService);
  cartService = inject(CartService);



  productId: number | undefined;

  //Error message

  // Product to display
  productDetail = this.productsService.product;
  errorMessage = this.productsService.productErro;

  pageTitle = computed(() => 
      this.productDetail() ? 'Product Detail for ' + this.productDetail()?.productName : 'Product Detial' )
  



  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

}
