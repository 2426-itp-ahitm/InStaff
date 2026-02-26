package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.employee.EmployeeDTO;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

public record ShiftDTO(
        Long id,
        String shiftName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        Long companyId,
        String company_name,
        List<Long> employees,
        List<Long> reservations
) {
}
