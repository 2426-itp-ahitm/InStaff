package at.instaff.features.company;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;

@Entity
public class Company extends PanacheEntity {
    @Column(name = "company_name")
    public String companyName;
}
