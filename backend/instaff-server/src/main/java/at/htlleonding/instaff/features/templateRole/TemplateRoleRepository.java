package at.htlleonding.instaff.features.templateRole;

import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.shiftTemplate.ShiftTemplate;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class TemplateRoleRepository implements PanacheRepository<TemplateRole> {
    @Inject
    EntityManager entityManager;

    public List<TemplateRole> getByIds(List<Long> ids) {
        return find("id in ?1", ids).list();
    }

    @Transactional
    public void assign(List<TemplateRoleDTO> dtos, ShiftTemplate shiftTemplate) {
        for (TemplateRoleDTO dto : dtos) {
            TemplateRole role = new TemplateRole(entityManager.find(Role.class, dto.roleId()), shiftTemplate, dto.count());
            persist(role);
        }
    }

    @Transactional
    public void unassign(ShiftTemplate shiftTemplate) {
        for (TemplateRole templateRole : shiftTemplate.getTemplateRoles()) {
            delete(templateRole);
        }
    }
}
