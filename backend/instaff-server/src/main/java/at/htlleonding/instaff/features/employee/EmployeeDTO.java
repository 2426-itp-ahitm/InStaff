package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.shift.Shift;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record EmployeeDTO(
        Long id,
        String firstname,
        String lastname,
        String email,
        String telephone,
        String password,
        LocalDate birthdate,
        Long company_id,
        String company_name,
        List<Long> roles,
        List<Long> shifts
) { }
