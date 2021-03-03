import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config/config';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private user = new Subject<any>();
  private menusubject = new Subject<any>();
  private ruser = new Subject<any>();
  private userupdatedsubject = new Subject<any>();
  private cartsubject = new Subject<any>();
  constructor(private http: HttpClient) {}
  setuser(event: any) {
    this.user.next(event);
  }
  get setuserevent$() {
    return this.user.asObservable();
  }
  setcart(event: any) {
    this.cartsubject.next(event);
  }
  get setcartevent$() {
    return this.cartsubject.asObservable();
  }
  setmenusubject(event: any) {
    this.menusubject.next(event);
  }
  get setmenusubjectevent$() {
    return this.menusubject.asObservable();
  }
  setuserupdated(event: any) {
    this.userupdatedsubject.next(event);
  }
  get setuserupdatedevent$() {
    return this.userupdatedsubject.asObservable();
  }
  setruser(event: any) {
    this.ruser.next(event);
  }
  get setruserevent$() {
    return this.ruser.asObservable();
  }
  setCart(cart: any) {
    localStorage.setItem('cart', JSON.stringify(cart));
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
        localStorage.getItem('rid') +
        '/' +
        name,
      {
        observe: 'response',
      }
    );
  }
  sendping(rid: any, tableNo: any): Observable<any> {
    return this.http.get<any>(
      config.serverUrl + 'users/sendping/' + rid + '/' + tableNo,
      {
        observe: 'response',
      }
    );
  }
  getOrderList(id: any) {
    return this.http.get<any>(config.serverUrl + 'users/orders/' + id, {
      observe: 'response',
    });
  }
}
