package at.htlleonding.instaff.features.company;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String companyName;

    public String getCompanyName() {
        return companyName;
    }

    public Long getId() {
        return id;
    }
}
