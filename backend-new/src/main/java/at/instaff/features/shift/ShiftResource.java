package at.instaff.features.shift;

import at.instaff.features.assignment.Assignment;
import at.instaff.features.assignment.AssignmentCreateDTO;
import at.instaff.features.company.Company;
import at.instaff.features.employee.Employee;
import at.instaff.features.role.Role;
import at.instaff.features.security.CustomPrincipal;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import java.time.LocalDate;
import java.util.List;

@Path("shifts")
public class ShiftResource {

    @GET
    public Response getShifts(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        List<Shift> shifts = Shift.list("company.id", principal.getCompanyId());

        return Response.ok(shifts.stream().map(ShiftDTO::toResource)).build();
    }

    @GET
    @Path("/{id}")
    public Response getShift(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Shift shift = Shift.find("id=?1 and company.id=?2", id, principal.getCompanyId()).singleResult();

        return Response.ok(ShiftDTO.toResource(shift)).build();
    }

    @GET
    @Path("/date/{date}")
    public Response getShiftsByDate(@PathParam("date") String dateString, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        LocalDate date = LocalDate.parse(dateString);
        List<Shift> shifts = Shift.list("company.id=?1 and DATE(startTime)=?2", principal.getCompanyId(), date);

        return Response.ok(shifts.stream().map(ShiftDTO::toResource)).build();
    }

    @GET
    @Path("/betweendates/{startDate}/{endDate}")
    public Response getShiftsBetweenDates(@PathParam("startDate") String startDateString, @PathParam("endDate") String endDateString, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        LocalDate startDate = LocalDate.parse(startDateString);
        LocalDate endDate = LocalDate.parse(endDateString);
        List<Shift> shifts = Shift.list("company.id=?1 and DATE(startTime)>?2 and DATE(endTime)<?3", principal.getCompanyId(), startDate, endDate);

        return Response.ok(shifts.stream().map(ShiftDTO::toResource)).build();
    }

    @GET
    @Path("/employee/self")
    public Response getShiftsSelf(@Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        List<Shift> shifts = Shift.list("SELECT s FROM Shift s JOIN s.assignments a WHERE a.employee.id = ?1", principal.getEmployeeId());

        return Response.ok(shifts.stream().map(ShiftDTO::toResource)).build();
    }

    @POST
    @Transactional
    public Response createShift(ShiftCreateDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Shift shift = new Shift(dto.shiftName(), dto.startTime(), dto.endTime(), Company.findById(principal.getCompanyId()));
        shift.persist();

        return Response.status(Response.Status.CREATED).build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response deleteShift(@PathParam("id") long id, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();
        Shift shift = Shift.findById(id);

        if (shift == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        if (shift.company.id != principal.getCompanyId()) {
            return Response.status(Response.Status.FORBIDDEN).build();
        }

        shift.delete();
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @POST
    @Path("/create-with-assignments")
    @Transactional
    public Response createShiftWithAssignments(ShiftCreateWithAssignmentsDTO dto, @Context SecurityContext sc) {
        CustomPrincipal principal = (CustomPrincipal) sc.getUserPrincipal();

        Shift shift = new Shift(dto.shiftCreateDTO().shiftName(), dto.shiftCreateDTO().startTime(), dto.shiftCreateDTO().endTime(), Company.findById(principal.getCompanyId()));
        shift.persist();

        int status = Response.Status.CREATED.getStatusCode();

        for (AssignmentCreateDTO assignmentCreateDTO : dto.assignmentCreateDTOS()) {
            Employee employee = null;
            if (assignmentCreateDTO.employeeId() != null) {
                employee = Employee.findById(assignmentCreateDTO.employeeId());
            }

            Role role = Role.findById(assignmentCreateDTO.roleId());

            if (role != null) {
                Assignment assignment = new Assignment(employee, Shift.findById(shift.id),
                        role);
                assignment.persist();
            } else {
                status = 207;
            }
        }

        return Response.status(status).build();
    }

}
