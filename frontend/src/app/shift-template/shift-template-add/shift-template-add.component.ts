import {Component, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {CompanyServiceService} from '../../services/company-service/company-service.service';

@Component({
  selector: 'app-shift-template-add',
  imports: [
    FormsModule,
  ],
  templateUrl: './shift-template-add.component.html',
  styleUrl: './shift-template-add.component.css'
})
export class ShiftTemplateAddComponent {
  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService)
  companyService: CompanyServiceService = inject(CompanyServiceService)

  @ViewChild('shiftTemplateNameInput') shiftTemplateNameInput!: ElementRef;

  @Output() close = new EventEmitter<void>();

  save(): void {
    const newShiftTemplateName:string = this.shiftTemplateNameInput.nativeElement.value;

    const newShiftTemplate:ShiftTemplate = {
      id: -1,
      shiftTemplateName: newShiftTemplateName,
      companyId: this.companyService.getCompanyId(),
      templateRoles: []
    };

    this.shiftTemplateService.addShiftTemplate(newShiftTemplate);

    this.closeAddRole()
  }

  closeAddRole(): void {
    this.close.emit();
  }
}
