package at.htlleonding.instaff.features.role;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.shift.Shift;
import jakarta.persistence.*;

import java.util.*;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String roleName;

    @ManyToOne
    Company company;

    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinTable(
            name = "employee_role",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "employee_id", referencedColumnName = "id")
    )
    Set<Employee> employees = new HashSet<>();

    @OneToMany(mappedBy = "role", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Assignment> assignments = new LinkedList<>();

    public Role() {
    }

    public Role(String roleName, Company company) {
        this.roleName = roleName;
        this.company = company;
    }

    public Long getId() {
        return id;
    }

    public List<Long> getEmployeeIds() {
        return employees.stream()
                .map(Employee::getId).toList();

    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public void setEmployees(Set<Employee> employees) {
        this.employees = employees;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }

    public String getRoleName() {
        return roleName;
    }

    public Company getCompany() {
        return company;
    }

    public Set<Employee> getEmployees() {
        return employees;
    }

    public void addEmployee(Employee e) {
        employees.add(e);
    }
}
