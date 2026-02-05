import {inject, Injectable} from '@angular/core';
import {CompanyServiceService} from '../company-service/company-service.service';
import {environment} from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  companyService: CompanyServiceService = inject(CompanyServiceService)
  public getApiUrl(): string {
    return  `${environment.apiUrl}/${this.companyService.getCompanyId()}`
    //return `http://backend.philip-pfarrhofer.at/api/${this.companyService.getCompanyId()}`;
  }
}
