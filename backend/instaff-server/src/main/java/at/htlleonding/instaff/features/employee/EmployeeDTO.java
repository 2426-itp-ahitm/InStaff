package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.shift.Shift;
import at.htlleonding.instaff.features.shift.ShiftDTO;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public record EmployeeDTO(
        Long id,
        String keycloakUserId,
        String firstname,
        String lastname,
        String email,
        String telephone,
        LocalDate birthdate,
        boolean isManager,
        Long companyId,
        String companyName,
        List<Long> roles,
        List<Long> shifts,
        double hourlyWage,
        String address
) { }
