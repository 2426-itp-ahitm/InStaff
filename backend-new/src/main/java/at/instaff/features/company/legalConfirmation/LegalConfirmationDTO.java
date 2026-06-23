package at.instaff.features.company.legalConfirmation;

public record LegalConfirmationDTO(
        boolean dataIsCorrect,
        boolean authorizedToRegisterCompany,
        boolean acceptedPrivacyPolicy,
        boolean acceptedTerms
) {
    public static LegalConfirmationDTO toResource(CompanyLegalConfirmation legalConfirmation) {
        return new LegalConfirmationDTO(legalConfirmation.dataIsCorrect, legalConfirmation.authorizedToRegisterCompany, legalConfirmation.acceptedPrivacyPolicy, legalConfirmation.acceptedTerms);
    }
}
