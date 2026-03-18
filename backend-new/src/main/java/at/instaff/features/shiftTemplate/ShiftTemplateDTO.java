package at.instaff.features.shiftTemplate;

import at.instaff.features.templateRole.TemplateRoleDTO;

import java.util.List;

public record ShiftTemplateDTO(
        long id,
        String shiftTemplateName,
        List<TemplateRoleDTO> templateRoles
) {
    public static ShiftTemplateDTO toResource(ShiftTemplate shiftTemplate) {
        return new ShiftTemplateDTO(shiftTemplate.id, shiftTemplate.shiftTemplateName,
                shiftTemplate.templateRoles.stream().map(TemplateRoleDTO::toResource).toList());
    }
}
