package at.instaff.features.companySetupInvite;

import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

public class CompanySetupInvite extends PanacheEntity {
    @Column(name = "recipient_email", nullable = false)
    public String recipientEmail;
    @Column(name = "preliminary_company_name", nullable = false)
    public String preliminaryCompanyName;
    @Column(name = "setup_token", nullable = false, unique = true)
    public String setupToken;
    @Column(name = "setup_password_hash", nullable = false)
    public String setupPasswordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    public CompanySetupInviteStatus status = CompanySetupInviteStatus.OPEN;

    @OneToOne
    @JoinColumn(name = "company_id")
    public Company company;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "created_by")
    public String createdBy;

    @Column(name = "completed_at")
    public LocalDateTime completedAt;

    @Column(name = "disabled_at")
    public LocalDateTime disabledAt;

    @Column(name = "disabled_by")
    public String disabledBy;

    @Column(name = "failed_attempts", nullable = false)
    public int failedAttempts = 0;

    @Column(name = "locked_until")
    public LocalDateTime lockedUntil;

    public CompanySetupInvite() { }
}
