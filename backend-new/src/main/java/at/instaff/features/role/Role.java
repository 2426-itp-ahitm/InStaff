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

    @ManyToMany(mappedBy = "roles")
    public List<Employee> employees;

    @OneToMany(mappedBy = "role")
    public List<Assignment> assignments;
}
