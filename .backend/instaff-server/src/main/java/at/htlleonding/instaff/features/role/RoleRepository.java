package at.htlleonding.instaff.features.role;

import java.util.List;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class RoleRepository implements PanacheRepository<Role> {

    public List<Role> findByCompany(Long companyId) {
        return find("company.id", companyId).list();
    }

    @Transactional
    public Role updateRole(String roleName, String description, Long id) {
        Role role = findById(id);
        role.setRoleName(roleName);
        role.setDescription(description);
        persist(role);
        return role;
    }

}
