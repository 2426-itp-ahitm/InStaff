package at.htlleonding.instaff.features.role;

import java.util.List;

public record RoleDTO(
        Long id,
        String roleName,
        Long company_id,
        List<Long> employees
) {
}
