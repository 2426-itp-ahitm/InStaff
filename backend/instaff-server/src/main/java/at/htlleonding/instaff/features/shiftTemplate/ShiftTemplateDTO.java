package at.htlleonding.instaff.features.shiftTemplate;

import at.htlleonding.instaff.features.templateRole.TemplateRole;
import at.htlleonding.instaff.features.templateRole.TemplateRoleDTO;

import java.util.List;

public record ShiftTemplateDTO(
        long id,
        String shiftTemplateName,
        long companyId,
        List<TemplateRoleDTO> templateRoles
) {
}
