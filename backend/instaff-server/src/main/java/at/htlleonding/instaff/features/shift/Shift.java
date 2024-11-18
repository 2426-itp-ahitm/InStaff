package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.EmployeeShift.EmployeeShift;
import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.employee.Employee;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    Timestamp startTime;
    Timestamp endTime;
    @ManyToOne
    Company company;
    @OneToMany(mappedBy = "shift")
    List<EmployeeShift> employeeShifts;
    public Long getId() {
        return id;
    }
}
