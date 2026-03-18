package at.instaff.features.templateRole;

import at.instaff.features.role.RoleDTO;

public record TemplateRoleDTO(
        long id,
        RoleDTO role,
        int count
) {
    public static TemplateRoleDTO toResource(TemplateRole templateRole) {
        return new TemplateRoleDTO (templateRole.id, RoleDTO.toResource(templateRole.role), templateRole.count);
    }
}
