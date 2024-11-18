package at.htlleonding.instaff.features.EmployeeShift;

import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.shift.Shift;
import jakarta.persistence.*;

@Entity
public class EmployeeShift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    Employee employee;

    @ManyToOne
    Shift shift;

    public Long getId() {
        return id;
    }

    public Employee getEmployee() {
        return employee;
    }

    public Shift getShift() {
        return shift;
    }
}
