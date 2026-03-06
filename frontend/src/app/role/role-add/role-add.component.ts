import {Component, ElementRef, EventEmitter, HostListener, inject, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RoleServiceService} from '../role-service/role-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';

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
  @ViewChild('roleDescriptionInput') roleDescriptionInput!: ElementRef;


  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {

    }else if (event.key === 'Escape') {
      this.closeAddRole()
    }
  }

  save(): void {
    const newRoleName:string = this.roleNameInput.nativeElement.value;
    const newRoleDescription:string = this.roleDescriptionInput.nativeElement.value;


    this.roleService.addRole(newRoleName, newRoleDescription);

    this.closeAddRole()
  }

  closeAddRole(): void {
    this.close.emit();
  }
}
