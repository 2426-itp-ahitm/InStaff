package at.htlleonding.instaff.features.employee;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

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
        return employees.stream().map(employeeMapper::toResource).toList();
    }
}
