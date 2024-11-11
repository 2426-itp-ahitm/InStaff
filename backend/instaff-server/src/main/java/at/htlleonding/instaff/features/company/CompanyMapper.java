package at.htlleonding.instaff.features.company;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class CompanyMapper {
    public CompanyDTO toResource(final Company company) {
        return new CompanyDTO(company.id, company.companyName);
    }
}
