import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, catchError, combineLatest, concatMap, filter, map, mergeMap, of, shareReplay, switchMap, tap, throwError } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { Review } from '../reviews/review';
import { ReviewService } from '../reviews/review.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Result } from '../utilities/result.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productsUrl = 'api/products';

  private http = inject(HttpClient);
  private reviewService = inject(ReviewService);
  private errorService = inject(HttpErrorService);


  // private selectedProductIdSubject = new BehaviorSubject<number | undefined>(undefined);
  // readonly slectedProductId$ = this.selectedProductIdSubject.asObservable();

  readonly selectedProductId = signal<number | undefined>(undefined);

  private readonly productsResult$ = this.http.get<Product[]>(this.productsUrl).pipe(
    map((p) => ({data: p, error: undefined} as Result<Product[]>)),
    tap((data) => console.log('Json Data' + JSON.stringify(data))),
    shareReplay(1),
    catchError((err) => of({
      data: [],
      error: this.errorService.formatError(err)
    } as Result<Product[]>))
  )


  private productsResult = toSignal(this.productsResult$, 
    {initialValue: {data: []} as Result<Product[]> })
  
  products = computed(() => {
    return this.productsResult().data;
  })

  productsError = computed(() => {
    return this.productsResult().error;
  })


  readonly productResult$ = toObservable(this.selectedProductId).pipe(
    tap((data) => console.log(data)),
    filter(Boolean),
    switchMap(id => this.getProductById(id)),
    catchError(err => of({
        data: undefined,
        error: this.errorService.formatError(err)
      } as Result<Product>)),
    map(p => ({data: p} as Result<Product>))
  )

  private productResult = toSignal(this.productResult$);

  product = computed(() => this.productResult()?.data);
  productErro = computed(() => this.productResult()?.error)


  // readonly product$ = combineLatest([this.products$, this.slectedProductId$]).pipe(
  //   map(([products, productId]) => {
  //     return products.find(item => item.id === productId)
  //   }),
  //   filter(Boolean),
  //   switchMap(product => this.getProductReviews(product))
  // )





  getProductById(productId: number | undefined): Observable<Product> {
    const productUrl = this.productsUrl + '/' + productId;
    return this.http.get<Product>(productUrl).pipe(
      tap(() => console.log(`In Product service get by Id pipeline`)),
      switchMap(product => this.getProductReviews(product)),
    )
  }




  private getProductReviews(product: Product): Observable<Product> {
    if(product.hasReviews) {
      return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id)).pipe(
        map((reviews) => ({...product, reviews} as Product))
      )
    } else {
      return of(product)
    }
  }

  selectedProductIdChanged(productId: number): void {
    this.selectedProductId.set(productId);
  }



  handleError(err: HttpErrorResponse): Observable<never> {
    return throwError(() => this.errorService.formatError(err))
  }
}
