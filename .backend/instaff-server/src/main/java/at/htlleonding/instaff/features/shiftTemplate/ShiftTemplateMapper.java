package at.htlleonding.instaff.features.shiftTemplate;

import at.htlleonding.instaff.features.templateRole.TemplateRoleMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class ShiftTemplateMapper {
    @Inject
    TemplateRoleMapper templateRoleMapper;

    public ShiftTemplateDTO toResource(final ShiftTemplate shiftTemplate) {
        return new ShiftTemplateDTO(shiftTemplate.id, shiftTemplate.shiftTemplateName, shiftTemplate.company.getId(),
                shiftTemplate.getTemplateRoles().stream().map(templateRoleMapper::toResource).toList());
    }
}
