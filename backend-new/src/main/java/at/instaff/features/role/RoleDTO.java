package at.instaff.features.role;

public record RoleDTO(
        long id,
        String roleName,
        String description
) {
    public static RoleDTO toResource(Role role) {
        return new RoleDTO(role.id, role.roleName, role.description);
    }
}
