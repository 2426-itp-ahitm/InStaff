import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  constructor() { }

  private companyId: number = 1;

  getCompanyId():number {
    return this.companyId;
  }

  setCompanyId(id:number) {
    this.companyId = id;
  }
}
