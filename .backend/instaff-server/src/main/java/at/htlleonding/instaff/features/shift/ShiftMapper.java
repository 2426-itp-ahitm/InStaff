package at.htlleonding.instaff.features.shift;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ShiftMapper {

    public ShiftDTO toResource(final Shift shift) {
        return new ShiftDTO(shift.id, shift.shiftName, shift.startTime, shift.endTime, shift.company.getId(), shift.company.getCompanyName(),
                shift.getEmployeeIds(), shift.getReservationIds());
    }
}
