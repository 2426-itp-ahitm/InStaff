import {Component, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RoleServiceService} from '../role-service/role-service.service';
import {FeedbackServiceService} from '../feedback-service/feedback-service.service';

@Component({
  selector: 'app-role-add',
  imports: [
    FormsModule,
  ],
  templateUrl: './role-add.component.html',
  styleUrl: './role-add.component.css'
})
export class RoleAddComponent {
  roleService: RoleServiceService = inject(RoleServiceService)

  @ViewChild('roleNameInput') roleNameInput!: ElementRef;

  @Output() close = new EventEmitter<void>();

  save(): void {
    const newRoleName:string = this.roleNameInput.nativeElement.value;

    this.roleService.addRole(newRoleName);

    this.closeAddRole()
  }

  closeAddRole(): void {
    this.close.emit();
  }
}
