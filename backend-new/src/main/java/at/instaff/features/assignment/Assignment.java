package at.instaff.features.assignment;

import at.instaff.features.employee.Employee;
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

    @Enumerated(EnumType.STRING)
    public AssignmentStatus status = AssignmentStatus.PENDING;
    public boolean seen = false;

    public Assignment() {}

    public Assignment(Employee employee, Shift shift, Role role, AssignmentStatus status) {
        this.employee = employee;
        this.shift = shift;
        this.role = role;
        this.status = status;
    }

    public Assignment(Shift shift, Role role) {
        this.shift = shift;
        this.role = role;
    }
}
