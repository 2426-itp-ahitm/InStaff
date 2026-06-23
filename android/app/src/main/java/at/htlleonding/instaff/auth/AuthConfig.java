package at.htlleonding.instaff.auth;

import android.net.Uri;

public final class AuthConfig {
    public static final String KEYCLOAK_BASE_URL = "http://10.0.2.2:8081";
    public static final String REALM = "instaff";
    public static final String CLIENT_ID = "instaff-android";
    public static final Uri AUTH_URI = Uri.parse(KEYCLOAK_BASE_URL + "/realms/" + REALM + "/protocol/openid-connect/auth");
    public static final Uri TOKEN_URI = Uri.parse(KEYCLOAK_BASE_URL + "/realms/" + REALM + "/protocol/openid-connect/token");
    public static final Uri LOGOUT_URI = Uri.parse(KEYCLOAK_BASE_URL + "/realms/" + REALM + "/protocol/openid-connect/logout");
    public static final Uri REDIRECT_URI = Uri.parse("at.htlleonding.instaff://oauth2redirect");
    public static final String SCOPE = "openid profile email offline_access";

    private AuthConfig() {
    }
}
