package at.htlleonding.instaff.features.company;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class CompanyMapper {

    public CompanyDTO toResource(final Company company) {
        return new CompanyDTO(company.id, company.companyName);
    }

    public Company fromCreateDTO(CompanyCreateDTO dto) {
        Company company = new Company();
        company.companyName = dto.companyName();
        return company;
    }
}
