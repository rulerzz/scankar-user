import { Component } from '@angular/core';
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'user';
  constructor(public socket: Socket) {
    this.socket.ioSocket.on('connect', () => {
      localStorage.setItem('socketid', this.socket.ioSocket.id);
    });
  }
}
