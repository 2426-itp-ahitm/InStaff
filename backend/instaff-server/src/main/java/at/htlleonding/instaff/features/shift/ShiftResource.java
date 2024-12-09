package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeCreateDTO;
import at.htlleonding.instaff.features.employee.EmployeeDTO;
import at.htlleonding.instaff.features.employee.EmployeeRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.util.LinkedList;
import java.util.List;

@Path("/shifts")
@Produces(MediaType.APPLICATION_JSON)
public class ShiftResource {
    @Inject
    ShiftRepository shiftRepository;
    @Inject
    ShiftMapper shiftMapper;
    @Inject
    EmployeeRepository employeeRepository;

    @GET
    public List<ShiftDTO> all() {
        var shifts = shiftRepository.listAll();
        return shifts
                .stream()
                .map(shiftMapper::toResource)
                .toList();
    }

    @GET
    @Path("{id}")
    public Response getEmployeeById(@PathParam("id") Long id) {
        var shift = shiftRepository.findById(id);
        if (shift == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        ShiftDTO shiftDTO = shiftMapper.toResource(shift);
        return Response.ok(shiftDTO).build();
    }

    @GET
    @Path("date/{date}")
    public List<ShiftDTO> getShiftsByDate(@PathParam("date") String dateString) {
        LocalDate date = LocalDate.parse(dateString);
        var shifts = shiftRepository.listAll();
        if (shifts == null) {
            return null;
        }
        List<Shift> shiftsWithDate = new LinkedList<Shift>();
        for (Shift shift : shifts) {
            if (shift.startTime.toLocalDate().equals(date)) {
                shiftsWithDate.add(shift);
            }
        }
        return shiftsWithDate
                .stream()
                .map(shiftMapper::toResource)
                .toList();
    }

    @GET
    @Path("company/{company_id}")
    public List<ShiftDTO> GetShiftsByCompany(@PathParam("company_id") Long companyId) {
        var shifts = shiftRepository.listAll();
        if (shifts == null) {
            return null;
        }
        List<Shift> shiftsWithCompany = new LinkedList<Shift>();
        for (Shift shift : shifts) {
            if (shift.company.getId().equals(companyId)) {
                shiftsWithCompany.add(shift);
            }
        }
        return shiftsWithCompany
                .stream()
                .map(shiftMapper::toResource)
                .toList();
    }

    @POST
    @Transactional
    public Response createShift(ShiftCreateDTO shiftCreateDTO) {
        // Map DTO to entity
        Shift shift = shiftMapper.fromCreateDTO(shiftCreateDTO);

        // Persist the entity
        shiftRepository.persist(shift);

        // Return a response with the created entity
        return Response.status(Response.Status.CREATED)
                .entity(shiftMapper.toResource(shift))
                .build();
    }

    /*@POST
    @Path("assign")
    @Transactional
    public Response assignEmployee(AssignRequest assignRequest) {
        Shift shift = shiftRepository.findById(assignRequest.shiftId);
        Employee employee = employeeRepository.findById(assignRequest.employeeId);
        if (shift == null || employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        } else {
            employeeShiftRepository.persist(new EmployeeShift(employee, shift));
        }
        return Response.status(Response.Status.CREATED)
                .build();
    }*/
}
