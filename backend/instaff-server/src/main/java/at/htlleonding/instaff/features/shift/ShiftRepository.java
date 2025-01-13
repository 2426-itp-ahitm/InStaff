package at.htlleonding.instaff.features.shift;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;

import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class ShiftRepository implements PanacheRepository<Shift> {
    @Inject
    EntityManager entityManager;

    public List<Shift> getByDate(LocalDate date) {
        String sql = "SELECT * FROM Shift s WHERE s.starttime = ?1";
        Query query = entityManager.createNativeQuery(sql, Shift.class);
        query.setParameter(1, date);

        return query.getResultList();
    }

    public List<Shift> getBetweenDates(LocalDate start, LocalDate end) {
        String sql = "SELECT * FROM Shift s WHERE DATE(s.starttime) BETWEEN ?1 AND ?2";
        Query query = entityManager.createNativeQuery(sql, Shift.class);
        query.setParameter(1, start);
        query.setParameter(2, end);

        return query.getResultList();
    }
}
