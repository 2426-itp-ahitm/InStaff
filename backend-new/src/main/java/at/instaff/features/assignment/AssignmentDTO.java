package at.instaff.features.assignment;

import at.instaff.features.employee.EmployeeShortDTO;
import at.instaff.features.role.RoleDTO;
import at.instaff.features.shift.ShiftShortDTO;

import java.util.List;

public record AssignmentDTO(
        long id,
        Boolean confirmed,
        Boolean seen,
        EmployeeShortDTO employee,
        ShiftShortDTO shift,
        RoleDTO role
) {
    public static AssignmentDTO toResource(Assignment assignment) {

        EmployeeShortDTO employeeShortDTO = null;
        if (assignment.employee != null) {
            employeeShortDTO = EmployeeShortDTO.toResource(assignment.employee);
        }

        return new AssignmentDTO(assignment.id, assignment.confirmed, assignment.seen, employeeShortDTO, ShiftShortDTO.toResource(assignment.shift),
                RoleDTO.toResource(assignment.role));
    }
}
