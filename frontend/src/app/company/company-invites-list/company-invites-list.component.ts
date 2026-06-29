import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CompanyStatus} from '../../interfaces/company-status';
import {AdminService} from '../../services/admin-service/admin.service';
import {CompanyListDto} from '../../interfaces/company-list-dto';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CompanyInvite} from '../../interfaces/company-invite';
import {CompanyInvitesWebsocketService} from '../company-invites-websocket-service/company-invites-websocket-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-company-invites-list',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './company-invites-list.component.html',
  styleUrl: './company-invites-list.component.css',
})
export class CompanyInvitesListComponent implements OnInit, OnDestroy {
  adminService: AdminService = inject(AdminService);
  companyInvitesWebsocketService: CompanyInvitesWebsocketService = inject(CompanyInvitesWebsocketService);
  private companyInvitesSubscription?: Subscription;
  private websocketSubscription?: Subscription;

  companyInvitesList: CompanyListDto[] = [];
  createInviteForm = new FormGroup({
    preliminaryCompanyName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    recipientEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email]
    })
  });

  CompanyStatus = CompanyStatus;

  ngOnInit() {
    this.companyInvitesSubscription = this.adminService.companyInviteList$.subscribe(companyInvites => {
      this.companyInvitesList = companyInvites;
      console.log(companyInvites)
    })

    this.websocketSubscription = this.companyInvitesWebsocketService.companyInvites$.subscribe(companyInvites => {
      this.adminService.setCompanyInvites(companyInvites);
    });

    this.adminService.getAllCompanyInvites();
    this.companyInvitesWebsocketService.connect();
  }

  ngOnDestroy() {
    this.companyInvitesSubscription?.unsubscribe();
    this.websocketSubscription?.unsubscribe();
    this.companyInvitesWebsocketService.disconnect();
  }

  createInvite(): void {
    if (this.createInviteForm.invalid) {
      this.createInviteForm.markAllAsTouched();
      alert('Bitte fülle Firmenname und eine gültige E-Mail aus.');
      return;
    }

    const compInvite: CompanyInvite = {
      preliminaryCompanyName: this.createInviteForm.value.preliminaryCompanyName || "Fehlgeschlagen",
      recipientEmail: this.createInviteForm.value.recipientEmail || "wrong@email.com"
    }

    this.adminService.addNewCompanyInvite(compInvite).subscribe(
      response => {
        alert(JSON.stringify(response, null, 2));
      }
    )


  }

  statusBadgeClasses(status: CompanyStatus | string | null): string {
    const baseClasses = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold';

    switch (status) {
      case 'OPEN':
      case CompanyStatus.OPEN:
        return `${baseClasses} bg-amber-100 text-amber-700`;
      case 'IN_PROGRESS':
      case CompanyStatus.IN_PROGRESS:
        return `${baseClasses} bg-blue-100 text-blue-700`;
      case 'COMPLETED':
      case CompanyStatus.COMPLETED:
        return `${baseClasses} bg-green-100 text-green-700`;
      case 'DISABLED':
      case CompanyStatus.DISABLED:
        return `${baseClasses} bg-gray-100 text-gray-700`;
      case 'DELETED':
      case CompanyStatus.DELETED:
        return `${baseClasses} bg-red-100 text-red-700`;
      case 'LOCKED':
      case CompanyStatus.LOCKED:
        return `${baseClasses} bg-purple-100 text-purple-700`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-700`;
    }
  }

  statusLabel(status: CompanyStatus | string | null): string {
    switch (status) {
      case 'OPEN':
        return CompanyStatus.OPEN;
      case 'IN_PROGRESS':
        return CompanyStatus.IN_PROGRESS;
      case 'COMPLETED':
        return CompanyStatus.COMPLETED;
      case 'DISABLED':
        return CompanyStatus.DISABLED;
      case 'DELETED':
        return CompanyStatus.DELETED;
      case 'LOCKED':
        return CompanyStatus.LOCKED;
      default:
        return status || 'UNBEKANNT';
    }
  }

  protected readonly alert = alert;
}
