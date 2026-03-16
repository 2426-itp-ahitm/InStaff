package at.instaff.features.role;

import at.instaff.features.assignment.Assignment;
import at.instaff.features.company.Company;
import at.instaff.features.employee.Employee;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Role extends PanacheEntity {
    @Column(name = "role_name")
    public String roleName;
    public String description;

    @ManyToOne
    public Company company;

    @ManyToMany(mappedBy = "roles", cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    public List<Employee> employees;

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Assignment> assignments;

    public Role() {}

    public Role(String roleName, String description, Company company) {
        this.roleName = roleName;
        this.description = description;
        this.company = company;
    }
}
