package at.htlleonding.instaff.features.role;

import at.htlleonding.instaff.features.company.CompanyRepository;
import at.htlleonding.instaff.features.employee.Employee;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class RoleMapper {
    @Inject
    CompanyRepository companyRepository;

    public RoleDTO toResource(final Role role) {
        return new RoleDTO(role.id, role.roleName, role.company.getId(), role.getEmployeeIds());
    }

    public Role fromCreateDTO(RoleCreateDTO roleCreateDTO) {
        Role role = new Role();
        role.roleName = roleCreateDTO.roleName();
        role.company = companyRepository.findById(roleCreateDTO.companyId());

        return role;
    }
}
