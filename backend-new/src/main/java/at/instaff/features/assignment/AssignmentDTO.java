package at.instaff.features.assignment;

import at.instaff.features.employee.EmployeeDTO;
import at.instaff.features.role.RoleDTO;
import at.instaff.features.shift.ShiftDTO;

public record AssignmentDTO(
        EmployeeDTO employee,
        ShiftDTO shift,
        RoleDTO role
) {
    public static AssignmentDTO toResource(Assignment assignment) {
        return new AssignmentDTO(EmployeeDTO.toResource(assignment.employee), ShiftDTO.toResource(assignment.shift),
                RoleDTO.toResource(assignment.role));
    }
}
