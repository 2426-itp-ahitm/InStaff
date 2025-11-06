import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Role} from '../../interfaces/role';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {RoleServiceService} from '../role-service/role-service.service';
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

@Component({
  selector: 'app-role-edit',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent implements OnInit {
  roleService: RoleServiceService = inject(RoleServiceService)
  employeeService: EmployeeServiceService = inject(EmployeeServiceService)
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)

  employeesWithRole: Employee[] = [];

  ngOnInit(): void {
    if (this.role.employees.length > 0) {
      for (let i = 0; i < this.role.employees.length; i++) {
        this.employeeService.getEnrichedEmployeeById(this.role.employees.at(i)!).subscribe(e => {
          this.employeesWithRole.push(e);
        });
      }
    }

  }

  @Input() role!: Role;

  @ViewChild('roleNameInput') roleNameInput!: ElementRef;

  @Output() closeRoleEdit = new EventEmitter<unknown>();

  save(): void {
    const updatedRole: Role = {
      ...this.role,
      roleName: this.roleNameInput.nativeElement.value
    };
    this.roleService.updateRole(updatedRole);
    this.close();
    this.feedbackService.newFeedback({message:"Role successfully saved", type: 'success', showFeedback: true})

  }

  close(): void {
    this.closeRoleEdit.emit();
  }

  deleteRole(roleToDelete: Role) {
    const confirmed = confirm(`Are you sure you want to delete the role ${ roleToDelete.roleName }?`);
    if (!confirmed) {
      return;
    }
    this.roleService.deleteRole(roleToDelete.id);
    this.feedbackService.newFeedback({message:"Role successfully deleted", type: 'error', showFeedback: true})

    this.close();
  }
}
