package at.htlleonding.instaff.features.assignment;

import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.shift.Shift;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@ApplicationScoped
public class AssignmentRepository implements PanacheRepository<Assignment> {
    @Inject
    EntityManager entityManager;

    public List<Assignment> findByShiftId(Long shiftId) {
        String sql = "SELECT a.* " +
                "FROM Assignment a " +
                "WHERE a.shift_id = ?1";

        Query query = entityManager.createNativeQuery(sql, Assignment.class);
        query.setParameter(1, shiftId);

        return query.getResultList();
    }

    public List<Assignment> findByEmployeeId(Long employeeId) {
        String sql = "SELECT a.* " +
                "FROM Assignment a " +
                "WHERE a.employee_id = ?1";
        Query query = entityManager.createNativeQuery(sql, Assignment.class);
        query.setParameter(1, employeeId);
        return query.getResultList();
    }

    public List<Assignment> findByEmployeeIdBetweenDates(Long employeeId, LocalDate startDate, LocalDate endDate) {
        String sql = "SELECT a.* " +
                "FROM assignment a " +
                "JOIN shift s ON a.shift_id = s.id " +
                "WHERE a.employee_id = ?3 AND s.starttime > ?1 AND s.endtime < ?2";

        Query query = entityManager.createNativeQuery(sql, Assignment.class);
        query.setParameter(1, startDate);
        query.setParameter(2, endDate);
        query.setParameter(3, employeeId);

        return query.getResultList();

    }

    public Assignment findByEmployeeAndShiftId(Long employeeId, Long shiftId) {
        String sql = "SELECT a.* " +
                "FROM Assignment a " +
                "WHERE a.shift_id = ?1 " +
                "AND a.employee_id = ?2";

        Query query = entityManager.createNativeQuery(sql, Assignment.class);
        query.setParameter(1, shiftId);
        query.setParameter(2, employeeId);

        return (Assignment) query.getSingleResult();
    }

    @Transactional
    public void setConfirmed(boolean confirmed, Long assignmentId) {
        Assignment assignment = entityManager.find(Assignment.class, assignmentId);
        assignment.setConfirmed(confirmed);
        entityManager.persist(assignment);
    }
}
