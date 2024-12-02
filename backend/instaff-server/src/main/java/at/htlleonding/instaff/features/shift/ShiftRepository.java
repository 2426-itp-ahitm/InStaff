package at.htlleonding.instaff.features.shift;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ShiftRepository implements PanacheRepository<Shift> {
}
