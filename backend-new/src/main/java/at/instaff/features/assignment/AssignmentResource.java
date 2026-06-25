package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import at.instaff.features.security.InternalAdminPrincipal;
import at.instaff.features.shift.Shift;
import at.instaff.features.shift.ShiftDTO;
import io.quarkus.logging.Log;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.security.Principal;
import java.util.List;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

@Path("/assignments")
public class AssignmentResource {
    @Inject
    AssignmentRepository assignmentRepository;
    @Inject
    AssignmentSocket assignmentSocket;

    @GET
    public Response getAssignments(@Context SecurityContext sc, @QueryParam("companyId") Long requestedCompanyId) {
        long companyId = resolveCompanyId(sc, requestedCompanyId);
        List<Assignment> assignments = assignmentRepository.getByCompanyId(companyId);
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
    public Response getAssignmentsByEmployee(
            @PathParam("employeeId") long employeeId,
            @Context SecurityContext sc,
            @QueryParam("companyId") Long requestedCompanyId
    ) {
        long companyId = resolveCompanyId(sc, requestedCompanyId);
        Employee employee = Employee.findById(employeeId);
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (employee.company.id != companyId) {
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
    public Response confirmAssignment(
            @PathParam("id") long id,
            @Context SecurityContext sc,
            @PathParam("isConfirmed") boolean isConfirmed,
            @QueryParam("companyId") Long requestedCompanyId
    ) {
        Assignment assignment = Assignment.findById(id);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Principal principal = sc.getUserPrincipal();

        if (principal instanceof InternalAdminPrincipal) {
            long companyId = requireAdminCompanyId(requestedCompanyId);
            if (assignment.shift.company.id != companyId) {
                return Response.status(Response.Status.FORBIDDEN).build();
            }

            applyConfirmation(assignment, isConfirmed);
            return Response.ok(AssignmentDTO.toResource(assignment)).build();
        }

        CustomPrincipal customPrincipal = (CustomPrincipal) principal;
        Employee employee = Employee.findById(customPrincipal.getEmployeeId());

        boolean isManager = employee.isManager;
        boolean isOwner = assignment.employee != null
                && assignment.employee.id == customPrincipal.getEmployeeId();

        if (!isManager && !isOwner) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (assignment.shift.company.id != customPrincipal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        applyConfirmation(assignment, isConfirmed);
        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    private void applyConfirmation(Assignment assignment, boolean isConfirmed) {
        if (isConfirmed) {
            assignment.status = AssignmentStatus.CONFIRMED;
        } else {
            assignment.status = AssignmentStatus.DECLINED;
        }

        assignment.seen = false;
        assignment.persist();
        assignmentSocket.broadcastAssignments(assignment);
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
        assignmentSocket.broadcastAssignments(assignment);

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
        Employee employee = Employee.find(
                "id = ?1 and company.id = ?2",
                dto.employeeId(),
                principal.getCompanyId()
        ).firstResult();

        if (employee != null) {
            assignment = new Assignment(employee, shift, role, AssignmentStatus.PENDING);
        } else {
            assignment = new Assignment();
            assignment.shift = shift;
            assignment.role = role;
            assignment.status = AssignmentStatus.PENDING;
            assignment.seen = false;
            assignment.employee = null;
        }

        if (employee != null && !employee.isSelfManaged) {
            assignment.status = AssignmentStatus.CONFIRMED;
        }

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
        Long oldEmployeeId = assignment.employee != null ? assignment.employee.id : null;

        Shift shift = Shift.findById(dto.shiftId());
        Role role = Role.findById(dto.roleId());
        if (shift == null || role == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        Employee employee = Employee.findById(dto.employeeId());
        if (employee != null) {
            boolean hasRole = employee.roles != null && employee.roles.stream()
                    .anyMatch(employeeRole -> employeeRole != null && employeeRole.id == role.id);
            if (!hasRole) {
                return Response.status(Response.Status.BAD_REQUEST).build();
            }
        }
        assignment.shift = shift;
        assignment.role = role;
        assignment.employee = employee;
        assignment.seen = false;
        Long newEmployeeId = assignment.employee != null ? assignment.employee.id : null;
        boolean employeeChanged = !Objects.equals(oldEmployeeId, newEmployeeId);

        if (employee == null) {
            assignment.status = AssignmentStatus.PENDING;
        } else if (employee.isSelfManaged) {
            assignment.status = AssignmentStatus.CONFIRMED;
        }

        if (employeeChanged) {
            assignment.status = AssignmentStatus.PENDING;
        }

        assignment.persist();
        assignmentSocket.broadcastAssignments(assignment);
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

    @GET
    @Path("/openForRequest")
    public Response getAssignmentsOpenForRequest(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Employee employee = Employee.findById(principal.getEmployeeId());
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        List<Assignment> userAssignments = Assignment.<Assignment>list(
                "employee.id = ?1 and shift.company.id = ?2",
                principal.getEmployeeId(),
                principal.getCompanyId()
        );

        Set<Long> blockedShiftIds = userAssignments.stream()
                .filter(a -> a.status != AssignmentStatus.DECLINED)
                .filter(a -> a.status != AssignmentStatus.REQUEST_DECLINED)
                .map(a -> a.shift.id)
                .collect(HashSet::new, HashSet::add, HashSet::addAll);

        Set<String> blockedDeclinedRoleKeys = userAssignments.stream()
                .filter(a -> a.status == AssignmentStatus.REQUEST_DECLINED)
                .map(a -> a.shift.id + "-" + a.role.id)
                .collect(HashSet::new, HashSet::add, HashSet::addAll);

        List<Assignment> ownRequestAssignments = userAssignments.stream()
                .filter(a -> a.status == AssignmentStatus.REQUESTED
                        || a.status == AssignmentStatus.REQUEST_CONFIRMED
                        || a.status == AssignmentStatus.REQUEST_DECLINED)
                .toList();

        Set<String> openShiftRoleKeys = new HashSet<>();
        List<Assignment> openAssignableAssignments = Assignment.<Assignment>list(
                "employee is null and shift.company.id = ?1",
                principal.getCompanyId()
        ).stream()
                .filter(a -> a.status == AssignmentStatus.PENDING)
                .filter(a -> !blockedShiftIds.contains(a.shift.id))
                .filter(a -> !blockedDeclinedRoleKeys.contains(a.shift.id + "-" + a.role.id))
                .filter(a -> hasRole(employee, a.role))
                .filter(a -> openShiftRoleKeys.add(a.shift.id + "-" + a.role.id))
                .toList();

        List<Assignment> assignmentList = new java.util.ArrayList<>();
        assignmentList.addAll(ownRequestAssignments);
        assignmentList.addAll(openAssignableAssignments);

        return Response.ok(assignmentList.stream().map(AssignmentDTO::toResource)).build();
    }

    @PUT
    @Transactional
    @Path("/{assignmentId}/request")
    public Response requestAssignment(@PathParam("assignmentId") long assignmentId, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Assignment assignment = Assignment.findById(assignmentId);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Employee employee = Employee.findById(principal.getEmployeeId());
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (assignment.shift.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (assignment.employee != null || assignment.status != AssignmentStatus.PENDING) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (!hasRole(employee, assignment.role)) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        assignment.status = AssignmentStatus.REQUESTED;
        assignment.employee = employee;
        assignment.seen = false;

        assignment.persist();
        assignmentSocket.broadcastAssignments(assignment);

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    @PUT
    @Transactional
    @Path("/{assignmentId}/withdrawRequest")
    public Response withdrawAssignment(@PathParam("assignmentId") long assignmentId, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Assignment assignment = Assignment.findById(assignmentId);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Employee employee = Employee.findById(principal.getEmployeeId());
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        if (assignment.shift.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        boolean isOwner = assignment.employee != null
                && assignment.employee.id == principal.getEmployeeId();

        if (!isOwner) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (assignment.status != AssignmentStatus.REQUESTED) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        assignment.status = AssignmentStatus.PENDING;
        assignment.employee = null;
        assignment.seen = false;

        assignment.persist();
        assignmentSocket.broadcastAssignments(assignment);

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    @PUT
    @Transactional
    @Path("/{assignmentId}/confirmRequest/{isConfirmed}")
    public Response confirmRequestForAssignment(@Context SecurityContext sc, @PathParam("assignmentId") long assignmentId, @PathParam("isConfirmed") boolean isConfirmed) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Assignment assignment = Assignment.findById(assignmentId);
        if (assignment == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        Employee employee = Employee.findById(principal.getEmployeeId());

        if (!employee.isManager) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (assignment.shift.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        if (assignment.status != AssignmentStatus.REQUESTED || assignment.employee == null) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }

        if (isConfirmed) {
            assignment.status = AssignmentStatus.REQUEST_CONFIRMED;
        } else {
            assignment.status = AssignmentStatus.REQUEST_DECLINED;
        }

        assignment.seen = false;
        assignment.persist();
        assignmentSocket.broadcastAssignments(assignment);

        return Response.ok(AssignmentDTO.toResource(assignment)).build();
    }

    private boolean hasRole(Employee employee, Role role) {
        return employee != null
                && employee.roles != null
                && role != null
                && employee.roles.stream().anyMatch(r -> r != null && r.id == role.id);
    }

    private long resolveCompanyId(SecurityContext sc, Long requestedCompanyId) {
        Principal principal = sc.getUserPrincipal();

        if (principal instanceof CustomPrincipal customPrincipal) {
            return customPrincipal.getCompanyId();
        }

        if (principal instanceof InternalAdminPrincipal) {
            return requireAdminCompanyId(requestedCompanyId);
        }

        throw new WebApplicationException(Response.Status.FORBIDDEN);
    }

    private long requireAdminCompanyId(Long requestedCompanyId) {
        if (requestedCompanyId == null) {
            throw new WebApplicationException("companyId is required for internal admins", Response.Status.BAD_REQUEST);
        }

        return requestedCompanyId;
    }

}
