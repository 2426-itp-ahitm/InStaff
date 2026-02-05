package at.htlleonding.instaff.features.security;

import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.employee.EmployeeRepository;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class EmployeeKeycloakSync {
    @Inject
    KeycloakAdminService keycloakAdminService;
    @Inject
    EmployeeRepository employeeRepository;

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        List<Employee> employeeList = employeeRepository.getAllEmployees();

        for (Employee employee : employeeList) {
            if (employee.keycloakUserId == null) {
                employee.keycloakUserId = keycloakAdminService.createUser(employee);
            }
        }
    }
}
