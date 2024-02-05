import { Injectable, computed, effect, signal } from "@angular/core";
import { CartItem } from "./cart";
import { Product } from "../products/product";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  cartCount = computed(() => {
    return  this.cartItems().reduce((acc, crr) => acc + crr.quantity, 0);
  })

  subTotal = computed(() => this.cartItems().reduce((acc, crr) => {
      return acc + (crr.quantity * crr.product.price)
  },0))


  deliveryFee = computed<number>(() => this.subTotal() < 50 ? 5.99 : 0);

  tax = computed(() => Math.round(this.subTotal() * 10.75)/100);

  totalPrice = computed(() => this.subTotal() + this.tax() + this.deliveryFee());

  cartLengthEffect = effect(() => console.log('Cart Items:' + this.cartItems().length))

  addToCart(product: Product): void {
    this.cartItems.update((cart) => [...cart, {product, quantity: 1}]);
  }


  removeCartItem(cartItem: CartItem) {
    this.cartItems.update(cart => 
      cart.filter(item => item.product.id !== cartItem.product.id))
  }

  updateQuanity(cartItem: CartItem, quantity: number) {
    this.cartItems.update(cart => {
      return cart.map(item => item.product.id == cartItem.product.id ? { product: cartItem.product, quantity } : item)
    })
  }

}
