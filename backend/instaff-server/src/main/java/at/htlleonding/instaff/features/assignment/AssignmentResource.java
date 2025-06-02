package at.htlleonding.instaff.features.assignment;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Path("{companyId}/assignments")
@Produces(MediaType.APPLICATION_JSON)
public class AssignmentResource {
    @Inject
    AssignmentRepository assignmentRepository;
    @Inject
    AssignmentMapper assignmentMapper;

    @GET
    public List<AssignmentDTO> all(@PathParam("companyId") Long companyId) {
        var assignments = assignmentRepository.findByCompanyId(companyId);
        return assignments
                .stream()
                .map(assignmentMapper::toResource)
                .toList();
    }

    @GET
    @Path("company/{companyId}")
    public Response getByCompanyId(@PathParam("companyId") long companyId) {
        List<Assignment> assignments = assignmentRepository.findByCompanyId(companyId);
        return Response.ok(
                assignments.stream().map(assignmentMapper::toResource).toList()
        ).build();
    }

    @GET
    @Path("{id}")
    public Response getById(@PathParam("id") Long id) {
        return Response.ok(assignmentMapper.toResource(assignmentRepository.findById(id))).build();
    }

    @GET
    @Path("shift/{shift}")
    public List<AssignmentDTO> getByShift(@PathParam("shift") Long shiftId) {
        var assignments = assignmentRepository.findByShiftId(shiftId);
        return assignments
                .stream()
                .map(assignmentMapper::toResource)
                .toList();
    }

    @GET
    @Path("employee/{employeeId}")
    public Response getAllAssignments(@PathParam("employeeId") Long employeeId) {
        List<Assignment> assignments = assignmentRepository.findByEmployeeId(employeeId);
        return Response.ok(assignments.stream().map(assignmentMapper::toResource)).build();
    }

    @GET
    @Path("employee/{employeeId}/{startDate}/{endDate}")
    public Response getAssignmentsBetweenDates(@PathParam("employeeId") Long employeeId, @PathParam("startDate") String startDateString, @PathParam("endDate") String endDateString) {
        LocalDate startDate = LocalDate.parse(startDateString);
        LocalDate endDate = LocalDate.parse(endDateString);
        if (endDate.isBefore(startDate)) {
            return Response.status(Response.Status.BAD_REQUEST).build();
        }
        List<Assignment> assignments = assignmentRepository.findByEmployeeIdBetweenDates(employeeId, startDate, endDate);
        return Response.ok(assignments.stream().map(assignmentMapper::toResource)).build();
    }
}
