package at.htlleonding.instaff.features.role;

import at.htlleonding.instaff.features.company.Company;
import jakarta.persistence.*;

@Entity
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String roleName;

    @ManyToOne
    Company company;

    public Long getId() {
        return id;
    }

    public String getRoleName() {
        return roleName;
    }

    public Company getCompany() {
        return company;
    }
}
