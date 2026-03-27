import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompanyServiceService {

  constructor() { }

  private companyId: number = 1;
  public isDataLoaded: boolean = false;
  defaultStartingHour: number = 12;
  defaultEndingHour: number = 18;


  getCompanyId():number {
    return this.companyId;
  }

  setCompanyId(id:number) {
    this.companyId = id;
  }

  getDefaultStartingHour(){
    return this.defaultStartingHour
  }

  getDefaultEndingHour(){
    return this.defaultEndingHour;
  }
}
