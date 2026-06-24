package at.instaff.features.companySetupInvite;

public record CompanySetupInviteResponseDTO(
        Long id,
        String recipientEmail,
        String preliminaryCompanyName,
        String setupToken,
        String setupPassword
) {
    public static CompanySetupInviteResponseDTO toResource(
            CompanySetupInvite invite,
            String rawSetupPassword
    ) {
        return new CompanySetupInviteResponseDTO(
                invite.id,
                invite.recipientEmail,
                invite.preliminaryCompanyName,
                invite.setupToken,
                rawSetupPassword
        );
    }
}
