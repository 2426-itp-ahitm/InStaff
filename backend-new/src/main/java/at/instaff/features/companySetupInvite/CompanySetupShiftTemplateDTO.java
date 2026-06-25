package at.instaff.features.companySetupInvite;

import java.util.List;

public record CompanySetupShiftTemplateDTO(
        String shiftTemplateName,
        List<CompanySetupTemplateRoleDTO> templateRoles
) {
}
