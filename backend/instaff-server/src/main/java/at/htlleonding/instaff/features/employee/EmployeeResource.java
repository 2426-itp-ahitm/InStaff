package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.company.CompanyRepository;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.role.RoleRepository;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.LinkedList;
import java.util.List;

@Path("/employees")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class EmployeeResource {
    @Inject
    EmployeeRepository employeeRepository;
    @Inject
    CompanyRepository companyRepository;
    @Inject
    EmployeeMapper employeeMapper;
    @Inject
    RoleRepository roleRepository;
    

    @GET
    public List<EmployeeDTO> all() {
        var employees = employeeRepository.listAll();
        return employees
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }

    @GET
    @Path("role/name")
    public List<EmployeeDTO> allRoles() {
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
        var employees = employeeRepository.findByRoleId(role);
        if (employees == null) {
            return null;
        }

        return employees
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }

    @GET
    @Path("role/name/{role}")
    public List<EmployeeDTO> getEmployeeByRoleName(@PathParam("role") String role) {
        var employees = employeeRepository.findByRoleName(role);
        if (employees == null) {
            return null;
        }

        return employees
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }

    @GET
    @Path("name/{name}")
    public List<EmployeeDTO> getEmployeeByName(@PathParam("name") String name) {
        var employees = employeeRepository.listAll();
        if (employees == null) {
            return null;
        }
        List<Employee> employeesWithName = new LinkedList<Employee>();
        for (Employee employee : employees) {
            if ((employee.firstname + " " + employee.lastname).toLowerCase().contains(name.toLowerCase())) {
                employeesWithName.add(employee);
            }
        }
        return employeesWithName
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }

    @GET
    @Path("company/{company_id}")
    public List<EmployeeDTO> getEmployeeByCompany(@PathParam("company_id") Long companyId) {
        var employees = employeeRepository.listAll();
        if (employees == null) {
            return null;
        }
        List<Employee> employeesWithCompany = new LinkedList<Employee>();
        for (Employee employee : employees) {
            if (employee.company.getId().equals(companyId)) {
                employeesWithCompany.add(employee);
            }
        }
        return employeesWithCompany
                .stream()
                .map(employeeMapper::toResource)
                .toList();
    }

    @POST
    @Transactional
    public Response createEmployee(EmployeeCreateDTO dto) {
        // Map DTO to entity
        Employee employee = new Employee(dto.firstname(), dto.lastname(), dto.email(), dto.telephone(),
                dto.password(), dto.birthdate(), companyRepository.findById(dto.companyId()));

        // Persist the entity
        employeeRepository.persist(employee);

        // Return a response with the created entity
        return Response.status(Response.Status.CREATED)
                .entity(employeeMapper.toResource(employee))
                .build();
    }

    @POST
    @Path("/{employeeId}")
    public Response updateEmployee(@PathParam("employeeId") Long employeeId, EmployeeEditDTO dto) {
        employeeRepository.editEmployee(employeeId, dto);
        return Response.status(Response.Status.OK).build();
    }

    @PUT
    @Path("/{employeeId}/removerole/{roleId}")
    public Response removeRole(@PathParam("employeeId") Long employeeId, @PathParam("roleId") Long roleId) {
        employeeRepository.removeRole(employeeId, roleId);

        return Response.status(Response.Status.OK).build();
    }

    @PUT
    @Path("/{employeeId}/assignrole/{roleId}")
    public Response assignRoleToEmployee(@PathParam("employeeId") Long employeeId, @PathParam("roleId") Long roleId) {
        employeeRepository.addRole(employeeId, roleId);

        return Response.ok().build();
    }

    @PUT
    @Path("/{employeeId}/assignshift/{shiftId}/{roleId}")
    public Response assignRoleToEmployee(@PathParam("employeeId") Long employeeId, @PathParam("shiftId") Long shiftId, @PathParam("roleId") Long roleId) {
        employeeRepository.addShift(employeeId, roleId, shiftId);

        return Response.ok("Shift assigned successfully").build();
    }

}
