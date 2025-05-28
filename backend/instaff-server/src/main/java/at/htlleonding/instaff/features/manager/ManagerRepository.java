package at.htlleonding.instaff.features.manager;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class ManagerRepository implements PanacheRepository<Manager> {

    public List<Manager> findByCompany(Long companyId) {
        return find("company.id", companyId).list();
    }
}
