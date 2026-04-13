package at.instaff.features.employee;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;

public record EmployeeShortDTO(
        long id,
        String keycloakUserId,
        String firstname,
        String lastname,
        String email,
        String telephone,
        @JsonProperty("birthdate")
        @JsonAlias("birthDate")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate birthDate,
        boolean isManager,
        double hourlyWage,
        String address,
        boolean isActive,
        boolean isSelfManaged
) {
    public static EmployeeShortDTO toResource(Employee employee) {
        return new EmployeeShortDTO(employee.id, employee.keycloakUserId, employee.firstName, employee.lastName, employee.email, employee.telephone, employee.birthDate,
                employee.isManager, employee.hourlyWage, employee.address, employee.isActive, employee.isSelfManaged);
    }
}
