package at.htlleonding.instaff.auth;

import android.net.Uri;

import at.htlleonding.instaff.BuildConfig;

public final class AuthConfig {
    // Defined per build type in app/build.gradle.kts: debug uses emulator-local Keycloak,
    // release uses the deployed Keycloak URL baked into the manually installed APK.
    public static final String KEYCLOAK_BASE_URL = BuildConfig.KEYCLOAK_BASE_URL;
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
