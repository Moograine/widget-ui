import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductWidgetModel } from '../models/product.model';
import { Observable } from 'rxjs';
import { Environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  constructor(private http: HttpClient) {
  }

  get path(): string {
    return Environment.production ? `${Environment.defaultAPI}/product-widgets` : `assets/files/data.json`;
  }

  /** Returns an Observable containing the data stream of product widgets */
  getProductWidgets(): Observable<ProductWidgetModel[]> {
    return <Observable<ProductWidgetModel[]>>this.http.get(this.path);
  }
}
