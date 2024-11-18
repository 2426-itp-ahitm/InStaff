package at.htlleonding.instaff.features.employee;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.LinkedList;
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
    @Path("role/{role}")
    public List<EmployeeDTO> getEmployeeByRole(@PathParam("role") Long role) {
        var employees = employeeRepository.listAll();
        if (employees == null) {
            return null;
        }
        List<Employee> employeesWithRole = new LinkedList<Employee>();
        for (Employee employee : employees) {
            if (employee.hasRoleWithId(role)) {
                employeesWithRole.add(employee);
            }
        }
        return employeesWithRole
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }
}
