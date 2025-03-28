package at.htlleonding.instaff.features.reservation;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ReservationRepository implements PanacheRepository<Reservation> {
}
