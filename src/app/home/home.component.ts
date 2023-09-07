import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList!: any[];
  products: any[] = [];
  subTotal!: any;
  constructor(
    private product_service: ProductService,
    // private router: Router
  ) {}

  ngOnInit() {
    this.product_service.getAllProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        this.productList = res;
      },
      error: (error) => {
        alert(error);
      },
      complete: () => {
        console.log('Request Completed');
      },
    });

    this.product_service.loadCart();
    this.products = this.product_service.getProduct();
  }

  //Add product to Cart
  addToCart(product: any) {
    if (!this.product_service.productInCart(product)) {
      product.quantity = 1;
      this.product_service.addToCart(product);
      this.products = [...this.product_service.getProduct()];
      this.subTotal = product.price;
    }
  }



  //Remove a Product from Cart
  removeFromCart(product: any) {
    this.product_service.removeProduct(product);
    this.products = this.product_service.getProduct();
  }

  //Calculate Total

  get total() {
    const subtotal = this.products?.reduce(
      (sum, product) => sum + product.quantity * product.price,
      0
    );
  
    // Calculate GST (10%)
    const gst = (subtotal * 0.1);
  
    // Calculate total price including GST
    const totalPrice = subtotal + gst;
  
    return totalPrice.toFixed(2);
  }
  
}
