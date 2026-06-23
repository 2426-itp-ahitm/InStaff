package at.instaff.features.company;

import at.instaff.features.employee.Employee;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

@Entity
public class Company extends PanacheEntity {
    @Column(name = "company_name", nullable = false)
    public String companyName;

    @Column(name = "uid_number")
    public String uidNumber;

    @Column(name = "public_email")
    public String publicEmail;

    @Column(name = "public_telephone")
    public String publicTelephone;

    @Column(name = "address")
    public String address;

    @Column(name = "location_name")
    public String locationName;

    @Column(name = "contact_person_name")
    public String contactPersonName;

    @Column(name = "contact_person_email")
    public String contactPersonEmail;

    @Column(name = "contact_person_telephone")
    public String contactPersonTelephone;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    public CompanyStatus status = CompanyStatus.SETUP;

    @ManyToOne
    @JoinColumn(name = "owner_employee_id")
    public Employee ownerEmployee;

    public Company() {}

    public Company(String companyName) {
        this.companyName = companyName;
    }
}