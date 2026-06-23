package at.htlleonding.instaff.features.shiftTemplate;

import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.templateRole.TemplateRole;
import at.htlleonding.instaff.features.templateRole.TemplateRoleRepository;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ShiftTemplateRepository implements PanacheRepository<ShiftTemplate> {
    @Inject
    EntityManager entityManager;
    @Inject
    TemplateRoleRepository templateRoleRepository;

    public List<ShiftTemplate> findByCompany(Long companyId) {
        return find("company.id", companyId).list();
    }

    @Transactional
    public ShiftTemplate create(ShiftTemplateCreateDTO dto) {

        ShiftTemplate shiftTemplate = new ShiftTemplate(dto.shiftTemplateName(), entityManager.find(Company.class, dto.companyId()));
        persist(shiftTemplate);
        templateRoleRepository.assign(dto.templateRoles(), shiftTemplate);
        return shiftTemplate;
    }
}
