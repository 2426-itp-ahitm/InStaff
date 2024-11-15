package at.htlleonding.instaff.features.employee;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
public class EmployeeResource {
    @Inject
    EmployeeRepository employeeRepository;
    @Inject
    EmployeeMapper employeeMapper;

    @GET
    public List<EmployeeDTO> all() {
        var employees = employeeRepository.listAll();
        return employees
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }

    @GET
    @Path("{id}")
    public Response getEmployeeById(@PathParam("id") Long id) {
        var employee = employeeRepository.findById(id);
        if (employee == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        EmployeeDTO employeeDTO = employeeMapper.toResource(employee);
        return Response.ok(employeeDTO).build();
    }

    @GET
    @Path("/role/{role}")
    public Response getEmployeeByRole(@PathParam("role") String role) {
        var employees = employeeRepository.listAll();
        if (employees == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        List<Employee> employeesWithRole;
        for (int i = 0; i < employees.size(); i++) {

        }
        return (Response) employees
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }
}
