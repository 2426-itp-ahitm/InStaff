package at.htlleonding.instaff.features.reservation;

import at.htlleonding.instaff.features.employee.EmployeeDTO;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ReservationMapper {
    public ReservationDTO toResource(final Reservation reservation) {
        return new ReservationDTO(reservation.id, reservation.name, reservation.infos, reservation.numberOfPeople, reservation.startTime, reservation.endTime, reservation.shift.getId());
    }
}
