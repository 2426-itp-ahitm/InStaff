package at.instaff.features.company;

public record CompanyDTO(
        long id,
        String companyName,
        CompanyStatus status
) {
    public static CompanyDTO toResource(Company company) {
        return new CompanyDTO(company.id, company.companyName, company.status);
    }
}
