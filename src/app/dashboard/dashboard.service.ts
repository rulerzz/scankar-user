import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config/config';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private usersubject = new Subject<boolean>();
  bill: any;
  category: any;
  user: any;
  ruser: any;
  constructor(private http: HttpClient) {}
  setUser(user: any) {
    this.user = user;
  }
  getUsers() {
    return this.user;
  }
  setRuser(ruser: any) {
    this.ruser = ruser;
  }
  getRuser() {
    return this.ruser;
  }
  setCart(cart: any) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  getCategory() {
    return this.category;
  }
  setCategory(category: any) {
    this.category = category;
  }
  getCart() {
    let json = JSON.parse(localStorage.getItem('cart'));
    if (json === null) {
      return [];
    } else return json;
  }
  addToCart(order: any) {
    let json = localStorage.getItem('cart');
    let cart = JSON.parse(json);
    if (cart === null) {
      cart = [];
    }
    cart.push(order);
    json = JSON.stringify(cart);
    localStorage.setItem('cart', json);
  }
  emptyCart() {
    localStorage.setItem('cart', JSON.stringify([]));
  }
  createUser(user: any): Observable<any> {
    return this.http.post<any>(config.serverUrl + 'users', user, {
      observe: 'response',
    });
  }
  getUser(id: any): Observable<any> {
    return this.http.get<any>(config.serverUrl + 'users/' + id, {
      observe: 'response',
    });
  }
  getAllUsers(offset: any): Observable<any> {
    return this.http.get<any>(config.serverUrl + 'users?offset=' + offset, {
      observe: 'response',
    });
  }
  updateuser(user: any): Observable<any> {
    return this.http.put<any>(config.serverUrl + 'users/update', user, {
      observe: 'response',
    });
  }
  deleteUser(id: any): Observable<any> {
    return this.http.delete<any>(config.serverUrl + 'users/' + id, {
      observe: 'response',
    });
  }
  getAllOrders(offset: any, user: any): Observable<any> {
    return this.http.get<any>(
      config.serverUrl + 'customer-order?offset=' + offset + '&user=' + user,
      {
        observe: 'response',
      }
    );
  }
  UpdateOrder(data: any): Observable<any> {
    return this.http.patch<any>(
      config.serverUrl + 'customer-order/update-order/' + data._id,
      data,
      {
        observe: 'response',
      }
    );
  }
  update(event: any) {
    this.usersubject.next(event);
  }

  get events$() {
    return this.usersubject.asObservable();
  }
  uploadPfp(id: any, image: any): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image);
    return this.http.post<any>(config.serverUrl + 'users/' + id, formData, {
      observe: 'response',
    });
  }
  createCategory(id: any, name: any, image: any): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image);
    return this.http.post<any>(
      config.serverUrl + 'users/category/' + id + '/' + name,
      formData,
      {
        observe: 'response',
      }
    );
  }
  createItem(
    id: any,
    name: any,
    price: any,
    category: any,
    configuration: any,
    image: any,
    addon: any
  ): Observable<any> {
    const formData = new FormData();
    formData.append('photo', image);
    formData.append('id', id);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('config', JSON.stringify(configuration));
    formData.append('addon', JSON.stringify(addon));
    return this.http.post<any>(
      config.serverUrl + 'users/insertuseritem/' + id,
      formData,
      {
        observe: 'response',
      }
    );
  }
  updateItemWithPic(
    id: any,
    name: any,
    price: any,
    category: any,
    configg: any,
    addons: any,
    upload: any
  ): Observable<any> {
    const formData = new FormData();
    formData.append('photo', upload);
    formData.append('_id', id);
    formData.append('name', name);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('config', JSON.stringify(configg));
    formData.append('addons', JSON.stringify(addons));
    return this.http.post<any>(
      config.serverUrl + 'users/updatepictureitemroute',
      formData,
      {
        observe: 'response',
      }
    );
  }
  updateItem(item: any): Observable<any> {
    return this.http.post<any>(
      config.serverUrl + 'users/updateitemrouter',
      item,
      {
        observe: 'response',
      }
    );
  }
  getalldata(id: any): Observable<any> {
    return this.http.get<any>(config.serverUrl + 'users/insertuseritem/' + id, {
      observe: 'response',
    });
  }
  deleteItem(id: any): Observable<any> {
    return this.http.get<any>(config.serverUrl + 'users/deleteuseritem/' + id, {
      observe: 'response',
    });
  }
  getAllUserData(): Observable<any> {
    return this.http.get<any>(config.serverUrl + 'users/search', {
      observe: 'response',
    });
  }
  getOrdersById(id: any): Observable<any> {
    return this.http.get<any>(
      config.serverUrl + 'customer-order/orderinfo/' + id,
      {
        observe: 'response',
      }
    );
  }
  itemInfo(itemid: any): Observable<any> {
    return this.http.get<any>(config.serverUrl + 'item/' + itemid, {
      observe: 'response',
    });
  }
  completeorder(order: any): Observable<any> {
    //order.socketid = localStorage.getItem('socketid');
    return this.http.post<any>(
      config.serverUrl + 'customer-order/completeorder',
      order,
      {
        observe: 'response',
      }
    );
  }
  getorderattable(tableno: any): Observable<any> {
    return this.http.post<any>(
      config.serverUrl + 'customer-order/checktable',
      { tableno: tableno, user: localStorage.getItem('rid') },
      {
        observe: 'response',
      }
    );
  }
  search(name: any): Observable<any> {
    return this.http.get<any>(
      config.serverUrl +
        'customer-order/searchitems/' +
        localStorage.getItem('rid') + '/' + name,
      {
        observe: 'response',
      }
    );
  }
  getCurrentBill() {
    return this.bill;
  }
  setCurrentBill(bill: any) {
    this.bill = bill;
  }
}
