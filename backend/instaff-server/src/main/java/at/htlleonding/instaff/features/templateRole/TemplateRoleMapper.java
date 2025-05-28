package at.htlleonding.instaff.features.templateRole;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class TemplateRoleMapper {

    public TemplateRoleDTO toResource(final TemplateRole templateRole) {
        return new TemplateRoleDTO(templateRole.getRole().getId(), templateRole.getCount());
    }
}
