package at.instaff.features.companySetupInvite;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CompanySetupInviteTest {

    @Test
    void generatedSetupPasswordUsesExpectedFormat() {
        CompanySetupInvite invite = new CompanySetupInvite();

        String setupPassword = invite.generateSetupPassword();

        assertTrue(setupPassword.matches("[A-Z2-9]{4}-[A-Z2-9]{4}"));
    }

    @Test
    void passwordMatchesOnlyAcceptsCorrectRawPassword() {
        CompanySetupInvite invite = new CompanySetupInvite();
        String storedHash = invite.hashPassword("ABCD-2345");

        assertTrue(invite.passwordMatches("ABCD-2345", storedHash));
        assertFalse(invite.passwordMatches("WRNG-2345", storedHash));
    }

    @Test
    void passwordMatchesRejectsInvalidInputWithoutThrowing() {
        CompanySetupInvite invite = new CompanySetupInvite();

        assertFalse(invite.passwordMatches(null, invite.hashPassword("ABCD-2345")));
        assertFalse(invite.passwordMatches("ABCD-2345", null));
        assertFalse(invite.passwordMatches("ABCD-2345", "invalid"));
        assertFalse(invite.passwordMatches("ABCD-2345", "not-a-number:salt:hash"));
        assertFalse(invite.passwordMatches("ABCD-2345", "120000:not-base64:hash"));
    }
}
