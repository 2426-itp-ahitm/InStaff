package at.instaff.features.assignment;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class AssignmentRepository implements PanacheRepository<Assignment> {

    public List<Assignment> getByCompanyId(long companyId) {
        return find(
                "select a from Assignment a " +
                        "left join fetch a.employee e " +
                        "join fetch a.shift s " +
                        "join fetch a.role r " +
                        "where s.company.id = ?1",
                companyId
        ).list();
    }

    public Assignment getById(long id, long companyId) {
        return find(
                "select a from Assignment a " +
                        "left join fetch a.employee e " +
                        "join fetch a.shift s " +
                        "join fetch a.role r " +
                        "where s.company.id = ?1" +
                        "and a.id = ?2",
                companyId, id
        ).singleResult();
    }
}
