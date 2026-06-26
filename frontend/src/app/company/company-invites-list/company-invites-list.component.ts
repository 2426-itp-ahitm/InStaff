import {Component, inject, OnInit} from '@angular/core';
import {CompanyStatus} from '../../interfaces/company-status';
import {AdminService} from '../../services/admin-service/admin.service';
import {CompanyListDto} from '../../interfaces/company-list-dto';

@Component({
  selector: 'app-company-invites-list',
  imports: [],
  templateUrl: './company-invites-list.component.html',
  styleUrl: './company-invites-list.component.css',
})
export class CompanyInvitesListComponent implements OnInit{
  adminService: AdminService = inject(AdminService);

  companyInvitesList: CompanyListDto[] = [];

  CompanyStatus = CompanyStatus;

  ngOnInit() {
    this.adminService.companyInviteList$.subscribe(companyInvites => {
      this.companyInvitesList = companyInvites;
      console.log(companyInvites)
    })

    this.adminService.getAllCompanyInvites();
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
}
