package at.instaff.features.security;

import at.instaff.features.employee.Employee;
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

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        List<Employee> employeeList = Employee.listAll();

        for (Employee employee : employeeList) {
            if (employee.keycloakUserId == null) {
                employee.keycloakUserId = keycloakAdminService.createUser(employee);
            }
        }
    }
}
