package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.company.CompanyRepository;
import at.htlleonding.instaff.features.employee.EmployeeMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class ShiftMapper {

    @Inject
    EmployeeMapper employeeMapper;
    @Inject
    CompanyRepository companyRepository;

    public ShiftDTO toResource(final Shift shift) {
        return new ShiftDTO(shift.id, shift.startTime, shift.endTime, shift.company.getId(), shift.company.getCompanyName(),
                shift.getEmployeeIds());
    }

    public Shift fromCreateDTO(ShiftCreateDTO shiftCreateDTO) {
        Shift shift = new Shift();
        shift.startTime = shiftCreateDTO.startTime();
        shift.endTime = shiftCreateDTO.endTime();
        shift.company = companyRepository.findById(shiftCreateDTO.companyId());

        return shift;
    }
}
