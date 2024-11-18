package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.EmployeeShift.EmployeeShift;
import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.shift.Shift;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String firstname;
    String lastname;
    String email;
    String telephone;
    String password;
    LocalDateTime birthdate;
    @ManyToOne
    Company company;
    @ManyToMany
    List<Role> roles;
    @OneToMany(mappedBy = "employee")
    List<EmployeeShift> employeeShifts;

    public boolean hasRoleWithId(Long id) {
        for (Role role : roles) {
            if (role.getId().equals(id)) {
                return true;
            }
        }
        return false;
    }

    public Long getId() {
        return id;
    }
}
