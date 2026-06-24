package at.instaff.features.mailService;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class MailService implements MailServiceInterface{
    @Inject
    Mailer mailer;

    @Override
    public void sendCompanySetupInvite(String recipientEmail, String setupLink, String setupPassword) {
        mailer.send(Mail.withText(
                recipientEmail,
                "Ihre InStaff Setup-Einladung",
                """
                        Willkommen bei InStaff!
                        
                        Ihr Setup-Link:
                        %s
                        
                        Ihr Setup-Passwort:
                        %s
                        
                        Bei Fragen freuen wir uns auf Ihren Anruf!
                        
                        Bitte bewahren Sie diese Daten sicher auf und geben Sie sie nicht an unbefugte weiter.
                        """.formatted(setupLink, setupPassword)
        ));
    }
}
