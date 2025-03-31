package at.htlleonding.instaff.features.reservation;

import at.htlleonding.instaff.features.shift.Shift;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ReservationRepository implements PanacheRepository<Reservation> {
    @Inject
    EntityManager entityManager;

    @Transactional
    public Reservation create(ReservationCreateDTO dto) {
        Reservation reservation = new Reservation(dto.name(), dto.infos(), dto.numberOfPeople(), dto.startTime(), dto.endTime(),
                entityManager.find(Shift.class, dto.shiftId()));
        persist(reservation);
        return reservation;
    }

}
