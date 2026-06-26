import {CompanyStatus} from './company-status';

export interface CompanyListDto {
  id: number,
  companyName: string,
  uidNumber: null | string,
  publicEmail: null | string,
  publicTelephone: null | string,
  address: null | string,
  locationName: null | string,
  contactPersonName: null | string,
  contactPersonEmail: null | string,
  contactPersonTelephone: null | string,
  status: CompanyStatus
}
