package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.assignment.AssignmentRepository;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.security.KeycloakAdminService;
import at.htlleonding.instaff.features.shift.Shift;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;

import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class EmployeeRepository implements PanacheRepository<Employee> {
    @Inject
    EntityManager entityManager;
    @Inject
    AssignmentRepository assignmentRepository;
    @Inject
    KeycloakAdminService keycloakAdminService;

    public List<Employee> getAllEmployees() {
        return entityManager.createNamedQuery(Employee.FIND_ALL, Employee.class).getResultList();
    }

    public List<Employee> getByCompanyId(Long companyId) {
        return entityManager.createNamedQuery(Employee.FIND_BY_COMPANY, Employee.class).setParameter("id", companyId).getResultList();
    }

    @Transactional
    public boolean deleteEmployee(Long employeeId) {
        Employee employee = entityManager.find(Employee.class, employeeId);
        if (employee != null) {
            entityManager.remove(employee);
            return true;
        } else {
            return false;
        }
    }

    public List<Employee> findByRoleId(Long roleId) {
        String sql = "SELECT e.* " +
                "FROM Employee e " +
                "JOIN employee_role er ON e.id = er.employee_id " +
                "WHERE er.role_id = ?1";

        Query query = entityManager.createNativeQuery(sql, Employee.class);
        query.setParameter(1, roleId);

        return query.getResultList();
    }

    public List<Employee> findByRoleName(String roleName) {
        String sql = "SELECT e.* " +
                "FROM Employee e " +
                "JOIN employee_role er ON e.id = er.employee_id " +
                "JOIN Role r ON er.role_id = r.id " +
                "WHERE LOWER(r.rolename) LIKE LOWER(?1)";

        Query query = entityManager.createNativeQuery(sql, Employee.class);
        query.setParameter(1, "%" + roleName + "%");

        return query.getResultList();
    }

    @Transactional
    public void addRole(Long employeeId, Long roleId) {
        // Find the Employee entity by ID
        Employee employee = findById(employeeId);
        if (employee == null) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " does not exist.");
        }

        // Find the Role entity by ID
        Role role = entityManager.find(Role.class, roleId);
        if (role == null) {
            throw new IllegalArgumentException("Role with ID " + roleId + " does not exist.");
        }

        // Check if the role is already assigned to the employee
        if (employee.getRoles().contains(role)) {
            throw new IllegalStateException("Role with ID " + roleId + " is already assigned to Employee with ID " + employeeId);
        }

        // Add the role to the employee's roles collection
        employee.getRoles().add(role);

        // Persist the updated employee entity
        persist(employee);
    }

    @Transactional
    public void removeRole(Long employeeId, Long roleId) {
        Employee employee = findById(employeeId);

        if (employee == null) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " does not exist.");
        }

        Role role = entityManager.find(Role.class, roleId);
        if (role == null) {
            throw new IllegalArgumentException("Role with ID " + roleId + " does not exist.");
        }

        employee.getRoles().remove(role);
        persist(employee);
    }

    @Transactional
    public void editEmployee(Long employeeId, EmployeeEditDTO dto) {
        Employee employee = findById(employeeId);
        if (employee == null) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " does not exist.");
        }
        employee.setFirstname(dto.firstname());
        employee.setLastname(dto.lastname());
        employee.setEmail(dto.email());
        employee.setBirthdate(dto.birthdate());
        employee.setTelephone(dto.telephone());
        employee.setManager(dto.isManager());
        if (dto.hourlyWage() != null) {
            employee.setHourlyWage(dto.hourlyWage());
        }
        if (dto.address() != null) {
            employee.setAddress(dto.address());
        }

        if (dto.roles() != null) {
            List<Role> roles = new LinkedList<>();
            for (Long roleId : dto.roles()) {
                roles.add(entityManager.find(Role.class, roleId));
            }
            employee.setRoles(roles);
        }

        persist(employee);
    }

    @Transactional
    public void addShift(Long employeeId, Long roleId, Long shiftId) {
        // Find the Employee entity by ID
        Employee employee = findById(employeeId);
        if (employee == null) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " does not exist.");
        }

        Shift shift = entityManager.find(Shift.class, shiftId);
        if (shift == null) {
            throw new IllegalArgumentException("Shift with ID " + shiftId + " does not exist.");
        }

        // Find the Role entity by ID
        Role role = entityManager.find(Role.class, roleId);
        if (role == null) {
            throw new IllegalArgumentException("Role with ID " + roleId + " does not exist.");
        }

        if (employee.getShiftIds().contains(shiftId)) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " is already assigned to Shift with ID " + shiftId + ".");
        }

        // Check if the role is already assigned to the employee
        if (!employee.getRoles().contains(role)) {
            throw new IllegalStateException("Employee with ID " + employeeId + " does not have Role with ID " + roleId + " so it can't be assigned for that shift.");
        }

        Assignment assignment = new Assignment();
        assignment.setEmployee(employee);
        assignment.setShift(shift);
        assignment.setRole(role);

        entityManager.persist(assignment);

        // Add the role to the employee's roles collection
        employee.getAssignments().add(assignment);

        // Persist the updated employee entity
        persist(employee);
    }

    @Transactional
    public void removeShift(Long employeeId, Long shiftId) {
        // Find the Employee entity by ID
        Employee employee = findById(employeeId);
        if (employee == null) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " does not exist.");
        }

        Shift shift = entityManager.find(Shift.class, shiftId);
        if (shift == null) {
            throw new IllegalArgumentException("Shift with ID " + shiftId + " does not exist.");
        }

        if (!employee.getShiftIds().contains(shiftId)) {
            throw new IllegalArgumentException("Employee with ID " + employeeId + " is not assigned to Shift with ID " + shiftId + ".");
        }

        Assignment assignment = assignmentRepository.findByEmployeeAndShiftId(employeeId, shiftId);

        // Add the role to the employee's roles collection
        employee.getAssignments().remove(assignment);

        assignmentRepository.delete(assignment);

        // Persist the updated employee entity
        persist(employee);
    }

    @Transactional
    public Employee createEmployee(Employee employee) {

        employee.setKeycloakUserId(null);
        persist(employee);
        flush();

        String keycloakUserId = keycloakAdminService.createUser(employee);

        employee.setKeycloakUserId(keycloakUserId);

        return employee;
    }
}