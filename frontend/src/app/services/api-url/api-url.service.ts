import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';


@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  companyService: CompanyServiceService = inject(CompanyServiceService)
  public getApiUrl(): string {
    return  `https://it210157.cloud.htl-leonding.ac.at/api/${this.companyService.getCompanyId()}`
    //return `http://backend.philip-pfarrhofer.at/api/${this.companyService.getCompanyId()}`;
  }
}
