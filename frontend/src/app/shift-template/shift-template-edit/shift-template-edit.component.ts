import {Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Role} from '../../interfaces/role';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';
import {ShiftTemplate} from '../../interfaces/shift-template';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {FeedbackServiceService} from '../../feedback/feedback-service/feedback-service.service';
import {RoleServiceService} from '../../role/role-service/role-service.service';

@Component({
  selector: 'app-shift-template-edit',
  imports: [
    FormsModule,
    NgForOf
  ],
  templateUrl: './shift-template-edit.component.html',
  styleUrl: './shift-template-edit.component.css'
})
export class ShiftTemplateEditComponent implements OnInit {

  shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);
  feedbackService: FeedbackServiceService = inject(FeedbackServiceService)
  roleService: RoleServiceService = inject(RoleServiceService)



  @Input() shiftTemplate!: ShiftTemplate;
  @Output() closeShiftTemplateEdit = new EventEmitter<unknown>();

  @ViewChild('shiftTemplateNameInput') shiftTemplateNameInput!: ElementRef;

  ngOnInit(): void {
    this.roleService.getRoles();
  }

  save(): void {
    const updatedShiftTemplate: ShiftTemplate = {
      ...this.shiftTemplate,
      shiftTemplateName: this.shiftTemplateNameInput.nativeElement.value
    };
    this.shiftTemplateService.updateShiftTemplate(updatedShiftTemplate);
    this.close();

  }

  close(): void {
    this.closeShiftTemplateEdit.emit();
  }



  deleteShiftTemplate(shiftTemplateToDelte: ShiftTemplate) {
    const confirmed = confirm(`Are you sure you want to delete the role ${ shiftTemplateToDelte.shiftTemplateName }?`);
    if (!confirmed) {
      return;
    }
    this.shiftTemplateService.deleteShiftTemplate(shiftTemplateToDelte.id);
    this.feedbackService.newFeedback({message:"Shift Template successfully deleted", type: 'error', showFeedback: true})

    this.close();
  }
}
