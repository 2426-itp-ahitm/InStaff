package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.EmployeeShift.EmployeeShift;
import at.htlleonding.instaff.features.EmployeeShift.EmployeeShiftRepository;
import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeDTO;
import at.htlleonding.instaff.features.employee.EmployeeRepository;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
    EmployeeShiftRepository employeeShiftRepository;
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
    }
}
