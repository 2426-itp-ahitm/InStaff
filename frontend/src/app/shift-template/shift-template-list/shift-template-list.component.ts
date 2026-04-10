import {Component, HostListener, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {ShiftTemplateServiceService} from '../shift-template-service/shift-template-service.service';
import {ShiftTemplateEditComponent} from '../shift-template-edit/shift-template-edit.component';
import {ShiftTemplateAddComponent} from '../shift-template-add/shift-template-add.component';
import {RoleServiceService} from '../../role/role-service/role-service.service';
import {Role} from '../../interfaces/role';
import {Shifttemplate} from '../../interfaces/shifttemplate';

@Component({
  selector: 'app-shift-template-list',
  imports: [
    NgForOf,
    NgIf,
    ShiftTemplateEditComponent,
    ShiftTemplateAddComponent,
    NgOptimizedImage
  ],
  templateUrl: './shift-template-list.component.html',
  styleUrl: './shift-template-list.component.css'
})
export class ShiftTemplateListComponent implements OnInit {
  private shiftTemplateService: ShiftTemplateServiceService = inject(ShiftTemplateServiceService);
  private roleService: RoleServiceService = inject(RoleServiceService);

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.openAddShiftTemplate()
    }else if (event.key === 'Escape') {

    }
  }


  shiftTemplates: Shifttemplate[] = [];
  roles: Role[] = [];
  searchTerm: string = '';
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  selectedShiftTemplate!: Shifttemplate;

  ngOnInit() {
    //gets all Templates
    this.shiftTemplateService.getShiftTemplates();
    this.shiftTemplateService.shiftTemplates$.subscribe((data) => {
      this.shiftTemplates = data;
    })
    this.roleService.getRoles()
    this.roleService.roles$.subscribe((data) => {
      this.roles = data;
    })
  }

  getRoleNameById(id: number) {
    return this.roles.find((r) => r.id === id)?.roleName || "";
  }

    onSearch(term: string) {
      this.searchTerm = term || '';
    }

    get filteredShiftTemplates(): Shifttemplate[] {
      const q = this.searchTerm.trim().toLowerCase();
      if (!q) return this.shiftTemplates;
      return this.shiftTemplates.filter(t => {
        const name = (t.shiftTemplateName || '').toLowerCase();
        return name.includes(q);
      });
    }

  openAddShiftTemplate() {
    this.isAddMode = true;

  }

  openShiftTemplateEdit(sT: Shifttemplate) {
    this.isEditMode = true;
    this.selectedShiftTemplate = sT
  }

  closeShiftTemplateEdit() {
    this.isEditMode = false;

  }

  closeShiftTemplateAdd() {
    this.isAddMode = false;
  }
}
