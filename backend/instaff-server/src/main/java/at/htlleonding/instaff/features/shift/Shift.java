package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.EmployeeShift.EmployeeShift;
import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.employee.Employee;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    LocalDateTime startTime;
    LocalDateTime endTime;
    @ManyToOne
    Company company;
    //@OneToMany(mappedBy = "shift")
    //List<EmployeeShift> employeeShifts;
    @ManyToMany
    @JsonIgnoreProperties("shifts")
    @JoinColumn(name = "employee_id")
    List<Employee> employees;
    public Long getId() {
        return id;
    }
}
