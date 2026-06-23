package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.assignment.AssignmentMapper;
import at.htlleonding.instaff.features.company.CompanyRepository;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.role.RoleRepository;
import at.htlleonding.instaff.features.security.CustomSecurityContext;
import at.htlleonding.instaff.features.security.KeycloakAdminService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.xml.bind.DatatypeConverter;
import org.eclipse.microprofile.config.ConfigProvider;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

@Path("{companyId}/employees")
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
    @Inject
    AssignmentMapper assignmentMapper;
    @Inject
    CustomSecurityContext ctx;
    @Inject
    KeycloakAdminService keycloakAdminService;

    @GET
    public Response all(@PathParam("companyId") Long companyId) {
        var employees = employeeRepository.getByCompanyId(companyId);
        return Response.ok(
                employees.stream().map(employeeMapper::toResource).toList()
        ).build();
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
    public List<EmployeeDTO> getEmployeesByCompany(@PathParam("company_id") Long companyId) {
        /*
        return employeeRepository
                .listAll()
                .stream()
                .filter(employee -> employee.company.getId().equals(companyId))
                .map(employeeMapper::toResource)
                .toList();
        */

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

    @DELETE
    @Path("delete/{employeeId}")
    public Response deleteEmployee(@PathParam("employeeId") Long employeeId) {
        if (employeeRepository.deleteEmployee(employeeId)) {
            return Response.status(Response.Status.NO_CONTENT).build();
        } else {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    }

    @POST
    public Response createEmployee(EmployeeCreateDTO dto) {
        List<Role> roles = new LinkedList<>();
        for (long roleId : dto.roles()) {
            roles.add(roleRepository.findById(roleId));
        }
        // Map DTO to entity
        Employee employee = new Employee(dto.firstname(), dto.lastname(), dto.email(), dto.telephone(), dto.birthdate(), companyRepository.findById(dto.companyId()), roles, dto.isManager(), dto.hourlyWage(), dto.address());

        // Persist the entity
        Employee createdEmployee = employeeRepository.createEmployee(employee);
        keycloakAdminService.createUser(employee);

        // Return a response with the created entity
        return Response.status(Response.Status.CREATED)
                .entity(employeeMapper.toResource(createdEmployee))
                .build();
    }

    @POST
    @Path("/{employeeId}")
    public Response updateEmployee(@PathParam("employeeId") Long employeeId, EmployeeEditDTO dto) {
        employeeRepository.editEmployee(employeeId, dto);
        return Response.ok(employeeMapper.toResource(employeeRepository.findById(employeeId))).build();
    }

    @PUT
    @Path("/{employeeId}/removerole/{roleId}")
    public Response removeRole(@PathParam("employeeId") Long employeeId, @PathParam("roleId") Long roleId) {
        employeeRepository.removeRole(employeeId, roleId);

        return Response.ok(employeeMapper.toResource(employeeRepository.findById(employeeId))).build();
    }

    @PUT
    @Path("/{employeeId}/assignrole/{roleId}")
    public Response assignRoleToEmployee(@PathParam("employeeId") Long employeeId, @PathParam("roleId") Long roleId) {
        employeeRepository.addRole(employeeId, roleId);

        return Response.ok(employeeMapper.toResource(employeeRepository.findById(employeeId))).build();
    }

    @PUT
    @Path("/{employeeId}/assignshift/{shiftId}/{roleId}")
    public Response assignShiftToEmployee(@PathParam("employeeId") Long employeeId, @PathParam("shiftId") Long shiftId, @PathParam("roleId") Long roleId) {
        employeeRepository.addShift(employeeId, roleId, shiftId);

        return Response.ok("Shift assigned successfully").build();
    }

    @PUT
    @Path("/{employeeId}/unassignshift/{shiftId}")
    public Response unassignShiftFromEmployee(@PathParam("employeeId") Long employeeId, @PathParam("shiftId") Long shiftId) {
        employeeRepository.removeShift(employeeId, shiftId);

        return Response.ok("Shift unassigned successfully").build();
    }
    @GET
    @Path("keycloak/{employeeKeycloakId}")
    public Response getEmployeeByKeycloakId(@PathParam("employeeKeycloakId") String kcId) {
        EmployeeDTO employeeDTO = employeeRepository.findByKcId(kcId);
        return Response.status(Response.Status.OK).entity(employeeDTO).build();
    }

    /*
    @PUT
    @Path("/login/{mail}/{password}")
    public Response login(@PathParam("mail") String mail, @PathParam("password") String password, @PathParam("companyId") Long companyId) {
        boolean isCorrect = employeeRepository.verifyPassword(mail, companyId, password);
        if (isCorrect) {
            return Response.ok("Password verified successfully").build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    @PUT
    @Path("/login-manager/{mail}/{password}")
    public Response loginManager(@PathParam("mail") String mail, @PathParam("password") String password, @PathParam("companyId") Long companyId) {
        boolean isCorrect = employeeRepository.verifyManagerPassword(mail, companyId, password);
        if (isCorrect) {
            return Response.ok("Password verified successfully").build();
        } else {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
    }

    public static String hashPassword(String password) {
        try {
            password += ConfigProvider.getConfig().getValue("password.salt", String.class);
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(password.getBytes(StandardCharsets.UTF_8));
            return DatatypeConverter.printHexBinary(hash).toLowerCase();
        } catch (Exception e) {
            throw new RuntimeException("Error hashing password", e);
        }
    }
    */

}
