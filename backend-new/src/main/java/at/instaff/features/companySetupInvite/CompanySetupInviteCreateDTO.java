package at.instaff.features.companySetupInvite;

public record CompanySetupInviteCreateDTO(
        String recipientEmail,
        String preliminaryCompanyName
) {

}
