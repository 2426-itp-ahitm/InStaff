package at.instaff.features.companySetupInvite;

import at.instaff.features.company.Company;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Base64;

import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

@Entity
public class CompanySetupInvite extends PanacheEntity {
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final String SETUP_PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

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

    public String generateUniqueToken() {
        String token;

        do {
            byte[] randomBytes = new byte[32];
            SECURE_RANDOM.nextBytes(randomBytes);

            token = Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
        } while (CompanySetupInvite.count("setupToken", token) > 0);

        return token;
    }

    public String generateSetupPassword() {
        return randomPasswordPart() + "-" + randomPasswordPart();
    }

    private String randomPasswordPart() {
        StringBuilder part = new StringBuilder(4);

        for (int i = 0; i < 4; i++) {
            int index = SECURE_RANDOM.nextInt(SETUP_PASSWORD_CHARS.length());
            part.append(SETUP_PASSWORD_CHARS.charAt(index));
        }

        return part.toString();
    }

    private static final int PASSWORD_HASH_ITERATIONS = 120_000;
    private static final int PASSWORD_HASH_KEY_LENGTH = 256;
    private static final int PASSWORD_SALT_LENGTH = 16;

    public String hashPassword(String rawPassword) {
        byte[] salt = new byte[PASSWORD_SALT_LENGTH];
        SECURE_RANDOM.nextBytes(salt);

        byte[] hash = pbkdf2(rawPassword, salt);

        return PASSWORD_HASH_ITERATIONS + ":" +
                Base64.getEncoder().encodeToString(salt) + ":" +
                Base64.getEncoder().encodeToString(hash);
    }

    public boolean passwordMatches(String rawPassword, String storedHash) {
        String[] parts = storedHash.split(":");
        if (parts.length != 3) {
            return false;
        }

        int iterations = Integer.parseInt(parts[0]);
        byte[] salt = Base64.getDecoder().decode(parts[1]);
        byte[] expectedHash = Base64.getDecoder().decode(parts[2]);

        byte[] actualHash = pbkdf2(rawPassword, salt, iterations);

        return java.security.MessageDigest.isEqual(expectedHash, actualHash);
    }

    private byte[] pbkdf2(String rawPassword, byte[] salt) {
        return pbkdf2(rawPassword, salt, PASSWORD_HASH_ITERATIONS);
    }

    private byte[] pbkdf2(String rawPassword, byte[] salt, int iterations) {
        try {
            PBEKeySpec spec = new PBEKeySpec(
                    rawPassword.toCharArray(),
                    salt,
                    iterations,
                    PASSWORD_HASH_KEY_LENGTH
            );

            return SecretKeyFactory
                    .getInstance("PBKDF2WithHmacSHA256")
                    .generateSecret(spec)
                    .getEncoded();
        } catch (NoSuchAlgorithmException | InvalidKeySpecException e) {
            throw new IllegalStateException("Could not hash setup password", e);
        }
    }
}
