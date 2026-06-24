package at.instaff.features.companySetupInvite;

public record CompanySetupDTO(
        Long id,
        String companyName,
        String uidNumber,
        String publicEmail,
        String publicTelephone,
        String address,
        String locationName,
        String contactPersonName,
        String contactPersonEmail,
        String contactPersonTelephone,
        CompanySetupInviteStatus status
) {
    public static CompanySetupDTO toResource(CompanySetupInvite invite) {
        if (invite.company == null) {
            return new CompanySetupDTO(
                    invite.id,
                    invite.preliminaryCompanyName,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    invite.recipientEmail,
                    null,
                    invite.status
            );
        }

        return new CompanySetupDTO(
                invite.id,
                invite.company.companyName,
                invite.company.uidNumber,
                invite.company.publicEmail,
                invite.company.publicTelephone,
                invite.company.address,
                invite.company.locationName,
                invite.company.contactPersonName,
                invite.company.contactPersonEmail,
                invite.company.contactPersonTelephone,
                invite.status
        );
    }
}
