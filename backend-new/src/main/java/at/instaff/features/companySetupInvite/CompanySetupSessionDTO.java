package at.instaff.features.companySetupInvite;

import java.time.LocalDateTime;

public record CompanySetupSessionDTO(
        String setupSessionToken,
        LocalDateTime createdAt,
        LocalDateTime expiresAt,
        boolean active
) {
    public static CompanySetupSessionDTO from(CompanySetupSession setupSession, String rawSetupSessionToken) {
        return new CompanySetupSessionDTO(rawSetupSessionToken, setupSession.createdAt, setupSession.expiresAt, setupSession.active);
    }
}
