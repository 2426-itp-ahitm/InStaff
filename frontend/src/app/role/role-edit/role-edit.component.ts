import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Role} from '../../interfaces/role';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {RoleServiceService} from '../role-service/role-service.service';
import {Employee} from '../../interfaces/employee';
import {EmployeeServiceService} from '../../employee/employee-service/employee-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

@Component({
  selector: 'app-role-edit',
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css'
})
export class RoleEditComponent implements OnInit {
  roleService: RoleServiceService = inject(RoleServiceService)
  employeeService: EmployeeServiceService = inject(EmployeeServiceService)
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)

  employeesWithRole: Employee[] = [];


  @Input() role!: Role;
  @Output() closeRoleEdit = new EventEmitter<unknown>();

  @ViewChild('roleNameInput') roleNameInput!: ElementRef;
  @ViewChild('roleDescriptionInput') roleDescriptionInput!: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      new this.closeRoleEdit()
    }
  }
  ngOnInit(): void {
    this.employeeService.getAllEmployeesByRoleId(this.role.id).subscribe(e => {
        this.employeesWithRole = e
      }
    )
    }

  save(): void {
    const updatedRole: Role = {
      ...this.role,
      roleName: this.roleNameInput.nativeElement.value,
      description: this.roleDescriptionInput.nativeElement.value,
    };
    this.roleService.updateRole(updatedRole);
    this.close();
    this.feedbackService.newFeedback({message:"Rolle erfolgreich gespeichert", type: 'success', showFeedback: true})

  }

  close(): void {
    this.closeRoleEdit.emit();
  }

  deleteRole(roleToDelete: Role) {
    const confirmed = confirm(`Bist du dir sicher, dass du die Rolle "${ roleToDelete.roleName }" löschen willst?`);
    if (!confirmed) {
      return;
    }
    this.roleService.deleteRole(roleToDelete.id);
    this.feedbackService.newFeedback({message:"Rolle erfolgreich gelöscht", type: 'error', showFeedback: true})

    this.close();
  }

  removeEmployeeFromRole(id: number) {
    this.employeeService.removeRoleFromEmployee(id, this.role.id).subscribe(data =>{
      this.employeeService.getAllEmployeesByRoleId(this.role.id).subscribe(e => {
        this.employeesWithRole = e
        console.log(e)
      })
    })
  }
}

