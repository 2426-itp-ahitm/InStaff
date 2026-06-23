package at.htlleonding.instaff.features.shiftTemplate;

import at.htlleonding.instaff.features.templateRole.TemplateRoleDTO;

import java.util.List;

public record ShiftTemplateCreateDTO(
        String shiftTemplateName,
        long companyId,
        List<TemplateRoleDTO> templateRoles
) {
}
