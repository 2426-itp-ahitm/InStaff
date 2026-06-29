import {Injectable, inject} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {KeycloakService} from 'keycloak-angular';
import {environment} from '../../../environments/environment';
import {CompanyListDto} from '../../interfaces/company-list-dto';

@Injectable({
  providedIn: 'root'
})
export class CompanyInvitesWebsocketService {
  private keycloakService = inject(KeycloakService);
  private socket?: WebSocket;
  private companyInvitesSubject = new Subject<CompanyListDto[]>();
  private connectionStateSubject = new BehaviorSubject<boolean>(false);

  public companyInvites$ = this.companyInvitesSubject.asObservable();
  public isConnected$ = this.connectionStateSubject.asObservable();

  connect(): void {
    void this.openConnection();
  }

  private async openConnection(): Promise<void> {
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      return;
    }

    const wsUrl = await this.buildWebSocketUrl();

    try {
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        this.connectionStateSubject.next(true);
      };

      this.socket.onmessage = (event) => {
        this.handleMessage(event.data);
      };

      this.socket.onerror = () => {
        this.connectionStateSubject.next(false);
      };

      this.socket.onclose = () => {
        this.connectionStateSubject.next(false);
        this.socket = undefined;
      };
    } catch (error) {
      console.error('Failed to create company invites WebSocket:', error);
      this.connectionStateSubject.next(false);
    }
  }

  private async buildWebSocketUrl(): Promise<string> {
    const wsBase = environment.wsUrl.replace(/\/$/, '');
    const companyInvitesUrl = `${wsBase}/company-setup-invites`;

    const token = await this.keycloakService.getToken();
    return `${companyInvitesUrl}?access_token=${encodeURIComponent(token)}`;
  }

  private handleMessage(data: string): void {
    if (data === 'connected') {
      return;
    }

    try {
      const companyInvites: CompanyListDto[] = JSON.parse(data);
      this.companyInvitesSubject.next(companyInvites);
    } catch (error) {
      console.error('Failed to parse company invites message:', error, data);
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
