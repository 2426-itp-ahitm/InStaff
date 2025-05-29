import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Shift} from '../interfaces/shift';

@Component({
  selector: 'app-shift-edit',
  imports: [],
  templateUrl: './shift-edit.component.html',
  styleUrl: './shift-edit.component.css'
})
export class ShiftEditComponent {
  @Output() closeShiftEdit = new EventEmitter<unknown>();
  @Input() shift!: Shift;

}
