package at.instaff.features.employee;

import at.instaff.features.company.CompanyDTO;
import at.instaff.features.role.RoleDTO;
import at.instaff.features.shift.ShiftDTO;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.List;

public record EmployeeDTO(
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
        Boolean isActive,
        Boolean isSelfManaged,
        CompanyDTO company,
        List<RoleDTO> roles
) {
    public static EmployeeDTO toResource(Employee employee) {
        return new EmployeeDTO(employee.id, employee.keycloakUserId, employee.firstName, employee.lastName, employee.email, employee.telephone, employee.birthDate,
                employee.isManager, employee.hourlyWage, employee.address, employee.isActive, employee.isSelfManaged, CompanyDTO.toResource(employee.company),
                employee.roles.stream().map(RoleDTO::toResource).toList());
    }
}
