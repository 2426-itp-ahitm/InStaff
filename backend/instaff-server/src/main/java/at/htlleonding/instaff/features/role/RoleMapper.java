package at.htlleonding.instaff.features.role;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoleMapper {

    public RoleDTO toResource(final Role role) {
        return new RoleDTO(role.id, role.roleName, role.company.getId(), role.getEmployeeIds());
    }
}
