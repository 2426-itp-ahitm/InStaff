package at.htlleonding.instaff.features.reservation;

import at.htlleonding.instaff.features.shift.Shift;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class ReservationRepository implements PanacheRepository<Reservation> {
    @Inject
    EntityManager entityManager;

    public List<Reservation> getByCompanyId(Long companyId) {
        return entityManager.createNamedQuery(Reservation.FIND_BY_COMPANY, Reservation.class).setParameter("id", companyId).getResultList();
    }

    @Transactional
    public Reservation create(ReservationCreateDTO dto) {
        Shift shift = entityManager.find(Shift.class, dto.shiftId());

        if (shift == null) {
            throw new NullPointerException("Shift not found");
        } else if (dto.startTime().isAfter(dto.endTime())) {
            throw new IllegalArgumentException("Start time is after end time");
        } else if (shift.getStartTime().toLocalTime().isAfter(dto.startTime()) || shift.getEndTime().toLocalTime().isBefore(dto.endTime())) {
            throw new IllegalArgumentException("Reservation time is outside of shift time");
        }

        Reservation reservation = new Reservation(dto.name(), dto.infos(), dto.numberOfPeople(), dto.startTime(), dto.endTime(), shift);
        persist(reservation);
        return reservation;
    }

}
