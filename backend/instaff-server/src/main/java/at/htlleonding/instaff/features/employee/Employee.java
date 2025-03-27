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
import java.util.*;
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

    public Employee() {
    }

    public Employee(String firstname, String lastname, String email, String telephone, String password, LocalDate birthdate, Company company) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.telephone = telephone;
        this.password = password;
        this.birthdate = birthdate;
        this.company = company;
    }

    public boolean hasRoleWithId(Long id) {
        for (Role role : roles) {
            if (role.getId().equals(id)) {
                return true;
            }
        }
        return false;
    }

    public String getEmail() {
        return email;
    }

    public void setFirstname(String firstname) {
        if (firstname != null && !firstname.isEmpty()) {
            this.firstname = firstname;
        }
    }

    public void setRoles(List<Role> roles) {
        this.roles = new HashSet<>(roles);
    }

    public void setLastname(String lastname) {
        if (lastname != null && !lastname.isEmpty()) {
            this.lastname = lastname;
        }
    }

    public void setEmail(String email) {
        if(email != null && email.contains("@")) {
            this.email = email;
        }
    }

    public void setTelephone(String telephone) {
        if (telephone != null && !telephone.isEmpty()) {
            this.telephone = telephone;
        }
    }

    public void setBirthdate(LocalDate birthdate) {
        if (birthdate != null && birthdate.isBefore(LocalDate.now())) {
            this.birthdate = birthdate;
        }
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

    public Set<Role> getRoles() {
        return roles;
    }

    public void addRole(Role role) {
        roles.add(role);
    }
}
