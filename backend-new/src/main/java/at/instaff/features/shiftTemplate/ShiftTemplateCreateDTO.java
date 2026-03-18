package at.instaff.features.shiftTemplate;

import at.instaff.features.templateRole.TemplateRoleCreateDTO;

import java.util.List;

public record ShiftTemplateCreateDTO(
        String shiftTemplateName,
        List<TemplateRoleCreateDTO> templateRoles
) {
}
