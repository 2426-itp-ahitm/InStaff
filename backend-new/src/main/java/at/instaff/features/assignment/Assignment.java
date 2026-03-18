package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
import at.instaff.features.news.News;
import at.instaff.features.role.Role;
import at.instaff.features.shift.Shift;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Assignment extends PanacheEntity {
    @ManyToOne
    @JoinColumn(name = "employee_id")
    public Employee employee;

    @ManyToOne
    @JoinColumn(name = "shift_id")
    public Shift shift;

    @ManyToOne
    @JoinColumn(name = "role_id")
    public Role role;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.REMOVE, orphanRemoval = true)
    public List<News> news;

    public Boolean confirmed;

    public Assignment() {}

    public Assignment(Employee employee, Shift shift, Role role) {
        this.employee = employee;
        this.shift = shift;
        this.role = role;
    }
}
