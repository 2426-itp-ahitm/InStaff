package at.htlleonding.instaff.features.employee;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class EmployeeRepository implements PanacheRepository<Employee> {
    @Inject
    EntityManager entityManager;

    public List<Employee> findByRoleId(Long role) {
        return find("role", role).stream().toList();
    }

    public List<Employee> findByRoleName(String roleName) {
        String sql = "SELECT e.* " +
                "FROM Employee e " +
                "JOIN employee_role er ON e.id = er.employee_id " +
                "JOIN Role r ON er.roles_id = r.id " +
                "WHERE LOWER(r.rolename) LIKE LOWER(?1)";

        Query query = entityManager.createNativeQuery(sql, Employee.class);
        query.setParameter(1, "%" + roleName + "%");

        return query.getResultList();
    }
}