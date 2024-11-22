package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.EmployeeShift.EmployeeShift;
import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeDTO;
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
    public Response assignEmployee(Long shiftId, Long employeeId) {
        Shift shift = shiftRepository.findById(shiftId);
        if (shift == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        } else {

        }
        return null;
    }
}
