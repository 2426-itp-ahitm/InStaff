package at.htlleonding.instaff.features.shift;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.employee.Employee;
import at.htlleonding.instaff.features.role.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    LocalDateTime startTime;
    LocalDateTime endTime;
    @ManyToOne
    Company company;

    @OneToMany(mappedBy = "shift", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Assignment> assignments;

    public List<Long> getEmployeeIds() {
        return assignments.stream()
                .map(Assignment::getEmployee).map(Employee::getId).toList();
    }

    public Long getId() {
        return id;
    }
}
