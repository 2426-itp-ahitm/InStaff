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
    @Column(unique = true)
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
    @Column(name = "is_active")
    public Boolean isActive = true;

    @ManyToOne()
    public Company company;

    @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "employee_role",
            joinColumns = @JoinColumn(name = "employee_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
    )
    public List<Role> roles;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Assignment> assignments;

    public Employee() {}

    public Employee(String firstName, String lastName, String email, String telephone, LocalDate birthDate, Double hourlyWage, String address, Boolean isManager, Company company, List<Role> roles, boolean isActive) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        this.birthDate = birthDate;
        this.hourlyWage = hourlyWage;
        this.address = address;
        this.isManager = isManager;
        this.company = company;
        this.roles = roles;
        this.isActive = isActive;
    }

    public void updateEmployee(String firstName, String lastName, String email, String telephone, LocalDate birthDate, Double hourlyWage, String address, Boolean isManager, List<Role> roles, boolean isActive) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.telephone = telephone;
        this.birthDate = birthDate;
        this.hourlyWage = hourlyWage;
        this.address = address;
        this.isManager = isManager;
        this.roles = roles;
        this.isActive = isActive;
    }
}
