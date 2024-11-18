package at.htlleonding.instaff.features.shift;

import jakarta.enterprise.context.ApplicationScoped;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class ShiftMapper {
    public ShiftDTO toResource(final Shift shift) {
        List<Long> employeeIds = new ArrayList<>();
        if (shift.employeeShifts != null) {
            for (int i = 0; i < shift.employeeShifts.size(); i++) {
                employeeIds.add(shift.employeeShifts.get(i).getEmployee().getId());
            }
        }
        return new ShiftDTO(shift.id, shift.startTime, shift.endTime, shift.company.getId(),
                employeeIds);
    }
}
