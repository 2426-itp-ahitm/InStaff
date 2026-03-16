package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import at.instaff.features.shift.Shift;
import at.instaff.features.shift.ShiftDTO;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

@Path("/assignments")
public class AssignmentResource {

    @POST
    @Transactional
    public Response createAssignment(AssignmentCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = Employee.find("id=?1 and company.id=?2", dto.employeeId(), principal.getCompanyId()).singleResult();
        Shift shift = Shift.findById(dto.shiftId());
        Role role = Role.findById(dto.roleId());
        if (employee == null || shift == null || role == null || !employee.roles.contains(role)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Assignment assignment = new Assignment(employee, shift, role);
        assignment.persist();
        return Response.status(Response.Status.CREATED).entity(AssignmentDTO.toResource(assignment)).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteAssignment(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Assignment assignment = Assignment.findById(id);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (assignment.employee.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        Assignment.deleteById(id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
