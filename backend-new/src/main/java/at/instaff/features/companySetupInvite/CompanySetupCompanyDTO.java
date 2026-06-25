package at.instaff.features.companySetupInvite;

public record CompanySetupCompanyDTO(
        String companyName,
        String uidNumber,
        String publicEmail,
        String publicTelephone,
        String address,
        String locationName,
        String contactPersonName,
        String contactPersonEmail,
        String contactPersonTelephone
) {
}
