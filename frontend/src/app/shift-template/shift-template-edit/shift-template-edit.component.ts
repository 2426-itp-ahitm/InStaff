import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Role} from '../../interfaces/role';
import {FormsModule} from '@angular/forms';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {Shifttemplate} from '../../interfaces/shifttemplate';
import {TemplateroleCreate} from '../../interfaces/templaterole-create';
import {ShifttemplateCreate} from '../../interfaces/shifttemplate-create';

@Component({
  selector: 'app-shift-template-edit',
  imports: [
    FormsModule
  ],
  templateUrl: './shift-template-edit.component.html',
  styleUrl: './shift-template-edit.component.css'
})
export class ShiftTemplateEditComponent implements OnInit {

  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  roleService: RoleServiceService = inject(RoleServiceService)



  @Input() shiftTemplate!: Shifttemplate;
  @Output() closeShiftTemplateEdit = new EventEmitter<unknown>();

  @ViewChild('shiftTemplateNameInput') shiftTemplateNameInput!: ElementRef;

  // UI state like in add component
  roles: Role[] = [];
  addedRoles: { role: Role; count: number }[] = []

  ngOnInit(): void {
    this.roleService.getRoles();
    this.roleService.roles$.subscribe(r => this.roles = r);

    //TODO
    // initialize addedRoles from the provided shiftTemplate
    if (this.shiftTemplate && this.shiftTemplate.templateRoles) {
      this.addedRoles = this.shiftTemplate.templateRoles.map(tr => ({ role: tr.role, count: tr.count }));
    }
  }

  //TODO
  save(): void {
    const newRoles: TemplateroleCreate[] = this.addedRoles.map(tr => ({
      roleId: tr.role.id,
      count: Math.max(1, tr.count)
    }));
    const updatedShiftTemplate: ShifttemplateCreate = {
      shiftTemplateName: this.shiftTemplateNameInput.nativeElement.value,
      templateRoles: newRoles
    };
    this.shiftTemplateService.updateShiftTemplate(updatedShiftTemplate, this.shiftTemplate.id);
    this.close();

  }

  close(): void {
    this.closeShiftTemplateEdit.emit();
  }



  deleteShiftTemplate(shiftTemplateToDelte: Shifttemplate) {
    const confirmed = confirm(`Bist du dir sicher, dass du die Schichtvorlage "${ shiftTemplateToDelte.shiftTemplateName }" löschen willst?`);
    if (!confirmed) {
      return;
    }
    this.shiftTemplateService.deleteShiftTemplate(shiftTemplateToDelte.id);
    this.close();
  }

  getRoleName(roleId: number): string {
    const r = this.roles.find(rr => rr.id === roleId);
    return r ? r.roleName : '';
  }

  availableRoles(): Role[] {
    return this.roles.filter(r => !this.addedRoles.some(ar => ar.role.id === r.id));
  }

  //TODO needs a Template Role Service
  addRole(roleIdStr: string) {
    const roleId = Number(roleIdStr);
    const role = this.roles.find(r => r.id === roleId)
    if (!roleId || role == undefined) return;
    const count = 1; // Default to 1
    this.addedRoles.push({ role , count });
  }

  removeAddedRole(index: number) {
    this.addedRoles.splice(index, 1);
  }

}
