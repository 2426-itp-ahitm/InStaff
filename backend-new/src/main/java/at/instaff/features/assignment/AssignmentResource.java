package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import at.instaff.features.shift.Shift;
import at.instaff.features.shift.ShiftDTO;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.util.List;

@Path("/assignments")
public class AssignmentResource {
    @Inject
    AssignmentRepository assignmentRepository;

    @GET
    public Response getAssignments(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        List<Assignment> assignments = assignmentRepository.getByCompanyId(principal.getCompanyId());
        return Response.ok(assignments.stream().map(AssignmentDTO::toResource)).build();
    }

    @GET
    @Path("/{id}")
    public Response getAssignment(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Assignment assignment = assignmentRepository.getById(id, principal.getCompanyId());

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    @GET
    @Path("/shift/{shiftId}")
    public Response getAssignmentsByShift(@PathParam("shiftId") long shiftId, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Shift shift = Shift.findById(shiftId);
        if (shift == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (shift.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        List<Assignment> assignments = Assignment.list("shift.id", shiftId);

        if (assignments.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(assignments.stream().map(AssignmentDTO::toResource)).build();
    }

    @GET
    @Path("/employee/{employeeId}")
    public Response getAssignmentsByEmployee(@PathParam("employeeId") long employeeId, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Employee employee = Employee.findById(employeeId);
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (employee.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        List<Assignment> assignments = Assignment.list("employee.id", employeeId);

        if (assignments.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(assignments.stream().map(AssignmentDTO::toResource)).build();
    }

    @PUT
    @Path("/{id}/confirm/{isConfirmed}")
    @Transactional
    public Response confirmAssignment(@PathParam("id") long id, @Context SecurityContext sc, @PathParam("isConfirmed") boolean isConfirmed) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Assignment assignment = Assignment.findById(id);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (principal.getEmployeeId() != assignment.employee.id) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }
        assignment.confirmed = isConfirmed;
        assignment.persist();

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

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
