package at.htlleonding.instaff.features.role;

import at.htlleonding.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class RoleRepository implements PanacheRepository<Role> {

    public List<Role> findByCompany(Long companyId) {
        return find("company.id", companyId).list();
    }

    @Transactional
    public Role updateRole(String roleName, Long id) {
        Role role = findById(id);
        role.setRoleName(roleName);
        persist(role);
        return role;
    }

}
