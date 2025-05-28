import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {DateClickArg} from '@fullcalendar/interaction';
import {ShiftServiceService} from '../shift-service.service';

@Component({
  selector: 'app-add-shift',
    imports: [
        FormsModule,
        NgForOf,
        ReactiveFormsModule
    ],
  templateUrl: './add-shift.component.html',
  styleUrl: './add-shift.component.css'
})
export class AddShiftComponent implements OnInit {
  selectedDate: DateClickArg | null = null;

  constructor(private shiftService:ShiftServiceService) {
  }
  ngOnInit(): void {
      this.selectedDate = this.shiftService.selectedDate
  }
  @Output() close = new EventEmitter<void>();


  save() {

  }

  closeAddShift() {
    this.close.emit();
  }
}
