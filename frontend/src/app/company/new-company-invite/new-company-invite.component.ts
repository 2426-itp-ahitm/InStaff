import {Component, inject} from '@angular/core';
import {AdminService} from '../../services/admin-service/admin.service';
import {CompanyInvite} from '../../interfaces/company-invite';

@Component({
  selector: 'app-new-company-invite',
  imports: [],
  templateUrl: './new-company-invite.component.html',
  styleUrl: './new-company-invite.component.css',
})
export class NewCompanyInviteComponent {
  adminService: AdminService = inject(AdminService)
  tempInvite: CompanyInvite = {
    preliminaryCompanyName: "Gelbes Krokodil",
    recipientEmail: "chef@kroko.dil"
  }

  sendTestCompany() {
    this.adminService.addNewCompanyInvite(this.tempInvite).subscribe(
      data => {
        console.log(data);
      }
    )
  }

}
