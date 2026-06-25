package at.instaff.features.companySetupInvite;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;

@Entity
public class CompanySetupSession extends PanacheEntity {
    @ManyToOne(optional = false)
    @JoinColumn(name = "invite_id")
    public CompanySetupInvite invite;

    @Column(name = "session_token_hash", nullable = false)
    public String sessionTokenHash;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    public LocalDateTime expiresAt;

    @Column(name = "last_used_at")
    public LocalDateTime lastUsedAt;

    @Column(name = "active", nullable = false)
    public boolean active = true;

    public CompanySetupSession() { }
}
