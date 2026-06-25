package at.instaff.features.companySetupInvite;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDate;
import java.util.List;

public record CompanySetupEmployeeDTO(
        String firstname,
        String lastname,
        String email,
        String telephone,
        @JsonProperty("birthdate")
        @JsonAlias("birthDate")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate birthDate,
        List<String> roleNames,
        double hourlyWage,
        String address,
        Boolean isManager,
        Boolean isActive,
        Boolean isSelfManaged
) {
}
