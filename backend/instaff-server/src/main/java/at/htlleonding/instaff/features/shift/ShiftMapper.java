package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.employee.EmployeeMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class ShiftMapper {

    @Inject
    EmployeeMapper employeeMapper;

    public ShiftDTO toResource(final Shift shift) {
        return new ShiftDTO(shift.id, shift.startTime, shift.endTime, shift.company.getId(), shift.company.getCompanyName(),
                shift.getEmployeeIds());
    }
}
