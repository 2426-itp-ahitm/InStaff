package at.instaff.features.company;

import at.instaff.features.companySetupInvite.CompanySetupInvite;
import at.instaff.features.companySetupInvite.CompanySetupInviteStatus;

public record CompanyOverviewDTO(
        Long companyId,
        Long setupInviteId,
        String companyName,
        CompanyStatus status,
        CompanySetupInviteStatus setupInviteStatus,
        String recipientEmail
) {
    public static CompanyOverviewDTO fromCompany(Company company) {
        return new CompanyOverviewDTO(
                company.id,
                null,
                company.companyName,
                company.status,
                null,
                company.publicEmail
        );
    }

    public static CompanyOverviewDTO fromInvite(CompanySetupInvite invite) {
        return new CompanyOverviewDTO(
                null,
                invite.id,
                invite.preliminaryCompanyName,
                statusFromInvite(invite.status),
                invite.status,
                invite.recipientEmail
        );
    }

    private static CompanyStatus statusFromInvite(CompanySetupInviteStatus inviteStatus) {
        return switch (inviteStatus) {
            case DISABLED, DELETED -> CompanyStatus.DISABLED;
            default -> CompanyStatus.SETUP;
        };
    }
}
