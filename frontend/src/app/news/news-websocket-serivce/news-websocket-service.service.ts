import { Injectable, inject } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { KeycloakService } from 'keycloak-angular';
import { AssignmentNews } from '../../interfaces/assignment-news';

@Injectable({
  providedIn: 'root'
})
export class NewsWebsocketServiceService {
  private keycloakService = inject(KeycloakService);
  private socket?: WebSocket;
  private assignmentUpdateSubject = new Subject<AssignmentNews>();
  private assignmentSeenSubject = new Subject<number>();
  private connectionStateSubject = new BehaviorSubject<boolean>(false);

  public assignmentUpdate$ = this.assignmentUpdateSubject.asObservable();
  public assignmentSeen$ = this.assignmentSeenSubject.asObservable();
  public isConnected$ = this.connectionStateSubject.asObservable();

  connect(): void {
    void this.openConnection();
  }

  private async openConnection(): Promise<void> {
    const wsUrl = await this.buildWebSocketUrl();

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        //console.log('WebSocket connected to assignments');
        this.connectionStateSubject.next(true);
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = (error) => {
        //console.error('WebSocket error:', error);
        this.connectionStateSubject.next(false);
      };

      this.socket.onclose = () => {
        //console.log('WebSocket disconnected');
        this.connectionStateSubject.next(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.connectionStateSubject.next(false);
    }
  }

  private async buildWebSocketUrl(): Promise<string> {
    const wsBase = environment.wsUrl.replace(/\/$/, '');
    const assignmentsUrl = `${wsBase}/assignments`;

    const token = await this.keycloakService.getToken();
    return `${assignmentsUrl}?access_token=${encodeURIComponent(token)}`;
  }

  private handleMessage(data: string): void {
    //console.log('WebSocket raw message:', data);

    if (data === 'connected') {
      //console.log('WebSocket connection confirmed');
      return;
    }

    if (data.startsWith('seen ')) {
      const assignmentId = parseInt(data.substring(5));
      //console.log('WebSocket assignment seen:', assignmentId);
      this.assignmentSeenSubject.next(assignmentId);
      return;
    }

    try {
      const assignment: AssignmentNews = JSON.parse(data);
      //console.log('WebSocket assignment update:', assignment);
      this.assignmentUpdateSubject.next(assignment);
    } catch (error) {
      console.error('Failed to parse assignment message:', error, data);
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = undefined;
    }
  }

  isConnected(): boolean {
    return this.connectionStateSubject.value;
  }
}
