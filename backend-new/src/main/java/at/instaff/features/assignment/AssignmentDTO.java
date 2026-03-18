package at.instaff.features.assignment;

import at.instaff.features.employee.EmployeeShortDTO;
import at.instaff.features.role.RoleDTO;
import at.instaff.features.shift.ShiftShortDTO;

import java.util.List;

public record AssignmentDTO(
        long id,
        Boolean confirmed,
        EmployeeShortDTO employee,
        ShiftShortDTO shift,
        RoleDTO role
) {
    public static AssignmentDTO toResource(Assignment assignment) {
        return new AssignmentDTO(assignment.id, assignment.confirmed, EmployeeShortDTO.toResource(assignment.employee), ShiftShortDTO.toResource(assignment.shift),
                RoleDTO.toResource(assignment.role));
    }
}
