package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.role.Role;
import jakarta.persistence.*;

import java.sql.Timestamp;
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
    Timestamp birthdate;
    @ManyToOne
    Company company;
    @ManyToMany
    List<Role> roles;

    public boolean hasRoleWithId(Long id) {
        for (Role role : roles) {
            if (role.getId().equals(id)) {
                return true;
            }
        }
        return false;
    }
}
