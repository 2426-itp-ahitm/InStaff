package at.htlleonding.instaff.features.role;

import java.util.List;

public record RoleDTO(
        Long id,
        String roleName,
        String description,
        Long companyId,
        List<Long> employees
) {
}
