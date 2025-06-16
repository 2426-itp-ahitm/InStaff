export interface ShiftTemplate {
  id: number;
  shiftTemplateName: string;
  companyId: number;
  templateRoles: TemplateRole[];
}


export interface TemplateRole {
  roleId: number;
  count: number;
}



