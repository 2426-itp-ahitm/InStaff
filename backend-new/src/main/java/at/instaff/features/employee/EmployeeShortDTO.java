package at.instaff.features.employee;

import java.time.LocalDate;

public record EmployeeShortDTO(
        long id,
        String keycloakUserId,
        String firstname,
        String lastname,
        String email,
        String telephone,
        LocalDate birthDate,
        boolean isManager,
        double hourlyWage,
        String address
) {
    public static EmployeeShortDTO toResource(Employee employee) {
        return new EmployeeShortDTO(employee.id, employee.keycloakUserId, employee.firstName, employee.lastName, employee.email, employee.telephone, employee.birthDate,
                employee.isManager, employee.hourlyWage, employee.address);
    }
}
