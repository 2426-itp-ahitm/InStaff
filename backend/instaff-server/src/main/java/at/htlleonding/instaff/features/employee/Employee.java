package at.htlleonding.instaff.features.employee;

import at.htlleonding.instaff.features.assignment.Assignment;
import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.role.Role;
import at.htlleonding.instaff.features.shift.Shift;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Entity
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String firstname;
    String lastname;
    String email;
    String telephone;
    String password;
    LocalDate birthdate;
    @ManyToOne
    Company company;
    @ManyToMany
            @JoinTable(
                    name = "employee_role",
                    joinColumns = @JoinColumn(name = "employee_id"),
                    inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")
            )
    Set<Role> roles = new HashSet<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Assignment> assignments = new LinkedList<>();

    public boolean hasRoleWithId(Long id) {
        for (Role role : roles) {
            if (role.getId().equals(id)) {
                return true;
            }
        }
        return false;
    }

    public List<Assignment> getAssignments() {
        return assignments;
    }

    public List<Long> getShiftIds() {
        return assignments.stream()
                .map(Assignment::getShift).map(Shift::getId).toList();

    }

    public List<Long> getRoleIds() {
        return roles.stream()
                .map(Role::getId).toList();
    }

    public Long getId() {
        return id;
    }

    public boolean hasRoleWithName(String name) {
        for (Role role : roles) {
            if (role.getRoleName().equalsIgnoreCase(name)) {
                return true;
            }
        }
        return false;
    }
}
