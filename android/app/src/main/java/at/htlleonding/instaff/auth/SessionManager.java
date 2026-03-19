package at.htlleonding.instaff.auth;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.Nullable;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import net.openid.appauth.AuthState;

public final class SessionManager {
    private static final String PREFS = "instaff_session";
    private static final String KEY_AUTH_STATE = "auth_state";
    private static SessionManager instance;

    private final SharedPreferences preferences;
    private final MutableLiveData<String> logoutEvents = new MutableLiveData<>();

    private SessionManager(Context context) {
        preferences = context.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static synchronized SessionManager getInstance(Context context) {
        if (instance == null) {
            instance = new SessionManager(context);
        }
        return instance;
    }

    public void saveAuthState(@Nullable AuthState authState) {
        if (authState == null) {
            preferences.edit().remove(KEY_AUTH_STATE).apply();
        } else {
            preferences.edit().putString(KEY_AUTH_STATE, authState.jsonSerializeString()).apply();
        }
    }

    @Nullable
    public AuthState getAuthState() {
        String value = preferences.getString(KEY_AUTH_STATE, null);
        if (value == null) {
            return null;
        }
        try {
            return AuthState.jsonDeserialize(value);
        } catch (Exception ignored) {
            preferences.edit().remove(KEY_AUTH_STATE).apply();
            return null;
        }
    }

    public boolean hasStoredSession() {
        AuthState authState = getAuthState();
        return authState != null && authState.getRefreshToken() != null;
    }

    public void clearSession(@Nullable String message) {
        preferences.edit().clear().apply();
        logoutEvents.postValue(message);
    }

    public LiveData<String> getLogoutEvents() {
        return logoutEvents;
    }
}
