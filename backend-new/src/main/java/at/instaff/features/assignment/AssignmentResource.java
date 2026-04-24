package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import at.instaff.features.shift.Shift;
import at.instaff.features.shift.ShiftDTO;
import io.quarkus.logging.Log;
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
    @Inject
    AssignmentSocket assignmentSocket;

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

        Employee employee = Employee.findById(principal.getEmployeeId());

        boolean isManager = employee.isManager;
        boolean isOwner = assignment.employee != null
                && assignment.employee.id == principal.getEmployeeId();

        if (!isManager && !isOwner) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (isConfirmed) {
            assignment.status = AssignmentStatus.CONFIRMED;
        } else {
            assignment.status = AssignmentStatus.DECLINED;
        }

        assignment.seen = false;
        assignment.persist();
        assignmentSocket.assignmentUpdated(assignment);

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    @PUT
    @Path("/{id}/mark-seen")
    @Transactional
    public Response markSeen(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Assignment assignment = Assignment.findById(id);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (principal.getCompanyId() != assignment.shift.company.id) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        assignment.seen = true;
        assignment.persist();
        assignmentSocket.assignmentSeen(assignment);

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    @POST
    @Transactional
    public Response createAssignment(AssignmentCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Shift shift = Shift.findById(dto.shiftId());
        Role role = Role.findById(dto.roleId());

        if (shift == null || role == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Assignment assignment;

        //if (dto.employeeId() != null) {
            Employee employee = Employee.find(
                    "id = ?1 and company.id = ?2",
                    dto.employeeId(),
                    principal.getCompanyId()
            ).firstResult();

            assignment = new Assignment(employee, shift, role, AssignmentStatus.PENDING);

            if (!employee.isSelfManaged) {
                assignment.status = AssignmentStatus.CONFIRMED;
            }
        //} else {
        //    assignment = new Assignment(shift, role);
        //}

        assignment.persist();

        return Response.status(Response.Status.CREATED)
                .entity(AssignmentDTO.toResource(assignment))
                .build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response updateAssignment(AssignmentCreateDTO dto, @PathParam("id") long id, @Context SecurityContext sc) {
        Assignment assignment = Assignment.findById(id);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Shift shift = Shift.findById(dto.shiftId());
        Role role = Role.findById(dto.roleId());
        if (shift == null || role == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Employee employee = null;
        if (dto.employeeId() != null) {
            employee = Employee.findById(dto.employeeId());

            if (!employee.roles.contains(role)) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
        }
        assignment.shift = shift;
        assignment.role = role;
        assignment.employee = employee;

        if (!employee.isSelfManaged) {
            assignment.status = AssignmentStatus.CONFIRMED;
        }

        assignment.persist();
        assignmentSocket.assignmentUpdated(assignment);
        return Response.ok(AssignmentDTO.toResource(assignment)).build();
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
        if (assignment.shift.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        Assignment.deleteById(id);
        return Response.status(Response.Status.NO_CONTENT).build();
    }
}
