package at.instaff.features.companySetupInvite;

import at.instaff.features.company.legalConfirmation.LegalConfirmationDTO;
import at.instaff.features.company.openingHour.OpeningHoursUpdateDTO;

import java.util.List;

public record CompanySetupCompleteDTO(
        CompanySetupCompanyDTO company,
        CompanySetupEmployeeDTO owner,
        OpeningHoursUpdateDTO openingHours,
        LegalConfirmationDTO legalConfirmation,
        List<CompanySetupRoleDTO> roles,
        List<CompanySetupShiftTemplateDTO> shiftTemplates,
        List<CompanySetupEmployeeDTO> employees
) {
}
