import { Component, inject, signal } from '@angular/core';

import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { EMPTY,  catchError, concatMap, delay, of, pipe, range, tap } from 'rxjs';

import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-list',
    templateUrl: './product-list.component.html',
    standalone: true,
  imports: [NgIf, NgFor, NgClass, ProductDetailComponent, AsyncPipe]
})
export class ProductListComponent  {
  pageTitle = 'Products';

  productsService = inject(ProductService);


  products = this.productsService.products;
  errorMessage = this.productsService.productsError;

  selectedProductId = this.productsService.selectedProductId;




  onSelected(productId: number): void {
    this.productsService.selectedProductIdChanged(productId);
  }


}
