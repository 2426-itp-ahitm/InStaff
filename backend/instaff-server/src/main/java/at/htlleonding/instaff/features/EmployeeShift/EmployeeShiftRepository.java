package at.htlleonding.instaff.features.EmployeeShift;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class EmployeeShiftRepository implements PanacheRepository<EmployeeShift> {
}
