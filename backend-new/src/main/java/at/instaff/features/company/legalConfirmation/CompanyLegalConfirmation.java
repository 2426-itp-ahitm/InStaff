package at.instaff.features.company.legalConfirmation;

import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;

public class CompanyLegalConfirmation extends PanacheEntity {
    @OneToOne(optional = false)
    @JoinColumn(name = "company_id")
    public Company company;

    @Column(name = "data_is_correct", nullable = false)
    public boolean dataIsCorrect;

    @Column(name = "authorized_to_register_company", nullable = false)
    public boolean authorizedToRegisterCompany;

    @Column(name = "accepted_privacy_policy", nullable = false)
    public boolean acceptedPrivacyPolicy;

    @Column(name = "accepted_terms", nullable = false)
    public boolean acceptedTerms;

    @Column(name = "confirmed_by_email")
    public String confirmedByEmail;

    @Column(name = "confirmed_at")
    public LocalDateTime confirmedAt;

    public CompanyLegalConfirmation() {}
}
