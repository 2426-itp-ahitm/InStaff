package at.instaff.features.companySetupInvite;

public record CompanySetupTokenValidationDTO(
        boolean valid,
        String preliminaryCompanyName
) {
}
