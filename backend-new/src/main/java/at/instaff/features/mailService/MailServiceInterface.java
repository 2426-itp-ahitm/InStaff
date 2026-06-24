package at.instaff.features.mailService;

public interface MailServiceInterface {
    void sendCompanySetupInvite(String recipientEmail, String setupLink, String setupPassword);
}
