export interface CompanySetupTokenValidation {
  valid: boolean;
  preliminaryCompanyName: string;
}

export interface CompanySetupSession {
  setupSessionToken: string;
  createdAt: string;
  expiresAt: string;
  active: boolean;
}

export interface CompanySetupCompany {
  companyName: string;
  uidNumber: string;
  publicEmail: string;
  publicTelephone: string;
  address: string;
  locationName: string;
  contactPersonName: string;
  contactPersonEmail: string;
  contactPersonTelephone: string;
}

export interface CompanySetupEmployee {
  firstname: string;
  lastname: string;
  email: string;
  telephone: string;
  birthdate: string;
  roleNames: string[];
  hourlyWage: number;
  address: string;
  isManager: boolean;
  isActive: boolean;
  isSelfManaged: boolean;
}

export interface CompanySetupOpeningHour {
  weekday: string;
  isClosed: boolean;
  startTime: string | null;
  endTime: string | null;
}

export interface CompanySetupOpeningHours {
  openingHours: CompanySetupOpeningHour[];
}

export interface CompanySetupLegalConfirmation {
  dataIsCorrect: boolean;
  authorizedToRegisterCompany: boolean;
  acceptedPrivacyPolicy: boolean;
  acceptedTerms: boolean;
}

export interface CompanySetupRole {
  roleName: string;
  description: string;
}

export interface CompanySetupTemplateRole {
  roleName: string;
  count: number;
}

export interface CompanySetupShiftTemplate {
  shiftTemplateName: string;
  templateRoles: CompanySetupTemplateRole[];
}

export interface CompanySetupComplete {
  company: CompanySetupCompany;
  owner: CompanySetupEmployee;
  openingHours: CompanySetupOpeningHours;
  legalConfirmation: CompanySetupLegalConfirmation;
  roles: CompanySetupRole[];
  shiftTemplates: CompanySetupShiftTemplate[];
  employees: CompanySetupEmployee[];
}
