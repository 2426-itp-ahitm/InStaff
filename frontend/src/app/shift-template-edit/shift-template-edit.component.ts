import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-shift-template-edit',
  imports: [],
  templateUrl: './shift-template-edit.component.html',
  styleUrl: './shift-template-edit.component.css'
})
export class ShiftTemplateEditComponent {
  @Input() shiftTemplate!: any;
  @Output() closeShiftTemplateEdit = new EventEmitter<unknown>();

}
