package at.htlleonding.instaff.auth;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import net.openid.appauth.AppAuthConfiguration;
import net.openid.appauth.AuthorizationException;
import net.openid.appauth.AuthorizationRequest;
import net.openid.appauth.AuthorizationResponse;
import net.openid.appauth.AuthorizationService;
import net.openid.appauth.AuthorizationServiceConfiguration;
import net.openid.appauth.EndSessionRequest;
import net.openid.appauth.AuthState;

public final class AuthManager {
    public static final String ACTION_AUTH_COMPLETE = "at.htlleonding.instaff.AUTH_COMPLETE";
    public static final String ACTION_AUTH_CANCEL = "at.htlleonding.instaff.AUTH_CANCEL";

    public interface AuthCallback {
        void onSuccess();

        void onError(@NonNull String message);
    }

    public interface TokenResultCallback {
        void onSuccess(@NonNull String accessToken);

        void onFailure();
    }

    private static AuthManager instance;

    private final Context context;
    private final AuthorizationService authorizationService;
    private final SessionManager sessionManager;

    private AuthManager(Context context) {
        this.context = context.getApplicationContext();
        this.authorizationService = new AuthorizationService(
                this.context,
                new AppAuthConfiguration.Builder()
                        .setConnectionBuilder(AllowAllConnectionBuilder.INSTANCE)
                        .build()
        );
        this.sessionManager = SessionManager.getInstance(context);
    }

    public static synchronized AuthManager getInstance(Context context) {
        if (instance == null) {
            instance = new AuthManager(context);
        }
        return instance;
    }

    public void startLogin(@NonNull Activity activity,
                           @NonNull AuthCallback callback) {
        AuthorizationServiceConfiguration configuration = new AuthorizationServiceConfiguration(
                AuthConfig.AUTH_URI,
                AuthConfig.TOKEN_URI,
                null,
                AuthConfig.LOGOUT_URI
        );

        AuthorizationRequest request = new AuthorizationRequest.Builder(
                configuration,
                AuthConfig.CLIENT_ID,
                "code",
                AuthConfig.REDIRECT_URI
        ).setScope(AuthConfig.SCOPE).build();

        Intent completeIntent = new Intent(activity, activity.getClass()).setAction(ACTION_AUTH_COMPLETE);
        Intent cancelIntent = new Intent(activity, activity.getClass()).setAction(ACTION_AUTH_CANCEL);

        PendingIntent completionPendingIntent = PendingIntent.getActivity(
                activity,
                1001,
                completeIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );
        PendingIntent cancelPendingIntent = PendingIntent.getActivity(
                activity,
                1002,
                cancelIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_MUTABLE
        );

        authorizationService.performAuthorizationRequest(request, completionPendingIntent, cancelPendingIntent);
    }

    public void handleAuthorizationResponse(@Nullable Intent intent, @NonNull AuthCallback callback) {
        AuthorizationResponse response = AuthorizationResponse.fromIntent(intent);
        AuthorizationException exception = AuthorizationException.fromIntent(intent);

        if (response == null) {
            callback.onError("Anmeldung wurde abgebrochen.");
            return;
        }

        AuthState authState = new AuthState(response, exception);
        authorizationService.performTokenRequest(response.createTokenExchangeRequest(), (tokenResponse, tokenException) -> {
            if (tokenResponse == null || tokenException != null) {
                callback.onError("Anmeldung konnte nicht abgeschlossen werden.");
                return;
            }

            authState.update(tokenResponse, tokenException);
            sessionManager.saveAuthState(authState);
            callback.onSuccess();
        });
    }

    public void performActionWithFreshTokens(@NonNull TokenResultCallback callback) {
        AuthState authState = sessionManager.getAuthState();
        if (authState == null) {
            callback.onFailure();
            return;
        }

        authState.performActionWithFreshTokens(authorizationService, (accessToken, idToken, exception) -> {
            if (exception != null || accessToken == null) {
                sessionManager.clearSession("Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.");
                callback.onFailure();
                return;
            }
            sessionManager.saveAuthState(authState);
            callback.onSuccess(accessToken);
        });
    }

    public void logout() {
        AuthState authState = sessionManager.getAuthState();
        sessionManager.clearSession(null);

        if (authState == null || authState.getAuthorizationServiceConfiguration() == null) {
            return;
        }

        Uri endSessionEndpoint = authState.getAuthorizationServiceConfiguration().endSessionEndpoint;
        if (endSessionEndpoint == null) {
            return;
        }

        EndSessionRequest request = new EndSessionRequest.Builder(authState.getAuthorizationServiceConfiguration())
                .setIdTokenHint(authState.getIdToken())
                .setPostLogoutRedirectUri(AuthConfig.REDIRECT_URI)
                .build();
        Intent intent = authorizationService.getEndSessionRequestIntent(request);
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        context.startActivity(intent);
    }
}
