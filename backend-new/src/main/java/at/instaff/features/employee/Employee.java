package at.instaff.features.employee;

import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;

import java.time.LocalDate;

@Entity
public class Employee extends PanacheEntity {
    public String firstName;
    public String lastName;
    public String email;
    public String telephone;
    public LocalDate birthDate;
    @Column(name = "keycloak_user_id")
    public String keycloakUserId;
    @Column(name = "hourly_wage")
    public Double hourlyWage;
    public String address;
    @Column(name = "is_manager")
    public Boolean isManager;
    @ManyToOne
    Company company;

}
