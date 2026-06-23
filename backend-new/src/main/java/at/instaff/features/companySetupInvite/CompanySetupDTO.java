package at.instaff.features.companySetupInvite;

public record CompanySetupDTO(
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
    public static CompanySetupDTO toResource(CompanySetupInvite invite) {
        return new CompanySetupDTO(invite.company.companyName, invite.company.uidNumber, invite.company.publicEmail, invite.company.publicTelephone, invite.company.address, invite.company.locationName, invite.company.contactPersonName, invite.company.contactPersonEmail, invite.company.contactPersonTelephone);
    }
}
