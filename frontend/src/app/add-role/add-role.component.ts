import {Component, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NewEmployee} from '../interfaces/new-employee';
import {EmployeeServiceService} from '../employee-service/employee-service.service';
import {RoleServiceService} from '../role-service/role-service.service';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';

@Component({
  selector: 'app-add-role',
  imports: [
    FormsModule,
  ],
  templateUrl: './add-role.component.html',
  styleUrl: './add-role.component.css'
})
export class AddRoleComponent {
  roleService: RoleServiceService = inject(RoleServiceService)
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)

  @ViewChild('roleNameInput') roleNameInput!: ElementRef;

  @Output() close = new EventEmitter<void>();

  save(): void {
    const newRoleName:string = this.roleNameInput.nativeElement.value;

    this.roleService.addRole(newRoleName);
    console.log('new role:', newRoleName);
    this.feedbackService.newFeedback({message:"Role successfully added", type: 'success', showFeedback: true})

    this.closeAddRole()
  }

  closeAddRole(): void {
    this.close.emit();
  }
}
