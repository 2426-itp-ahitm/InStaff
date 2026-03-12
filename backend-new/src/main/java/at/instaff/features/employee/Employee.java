package at.instaff.features.employee;

import at.instaff.features.assignment.Assignment;
import at.instaff.features.company.Company;
import at.instaff.features.role.Role;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
public class Employee extends PanacheEntity {
    public String firstName;
    public String lastName;
    public String email;
    public String telephone;
    public LocalDate birthDate;
    @Column(name = "keycloak_user_id")
    public String keycloakUserId;
    @Column(name = "hourly_wage")
    public Double hourlyWage;
    public String address;
    @Column(name = "is_manager")
    public Boolean isManager;

    @ManyToOne
    public Company company;

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name = "employee_role",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    public List<Role> roles;

    @OneToMany(mappedBy = "employee")
    public List<Assignment> assignments;

}
