import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsWebsocketServiceService {

  private socket?: WebSocket;
  private messageSubject = new Subject<string>();

  public connect(url: string): Observable<string> {
    this.socket = new WebSocket(url);

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return this.messageSubject.asObservable();
  }

  public sendMessage(msg: string): void {
    this.socket?.send(msg);
  }

}
