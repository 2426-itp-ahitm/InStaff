package at.htlleonding.instaff;

import android.content.Intent;
import android.os.Bundle;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.Fragment;

import com.google.android.material.snackbar.Snackbar;

import at.htlleonding.instaff.auth.AuthManager;
import at.htlleonding.instaff.auth.SessionManager;
import at.htlleonding.instaff.databinding.ActivityMainBinding;
import at.htlleonding.instaff.ui.loading.LoadingFragment;
import at.htlleonding.instaff.ui.login.LoginFragment;
import at.htlleonding.instaff.ui.main.MainContainerFragment;

public class MainActivity extends AppCompatActivity implements
        LoginFragment.LoginHost,
        LoadingFragment.LoadingHost,
        MainContainerFragment.MainNavigationHost {

    private ActivityMainBinding binding;
    private SessionManager sessionManager;
    private AuthManager authManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        sessionManager = SessionManager.getInstance(getApplicationContext());
        authManager = AuthManager.getInstance(getApplicationContext());

        sessionManager.getLogoutEvents().observe(this, message -> {
            if (message != null && !message.isBlank()) {
                Snackbar.make(binding.getRoot(), message, Snackbar.LENGTH_LONG).show();
            }
            showLogin(null);
        });

        handleAuthIntent(getIntent());

        if (savedInstanceState == null) {
            if (sessionManager.hasStoredSession()) {
                showLoading();
            } else {
                showLogin(null);
            }
        }
    }

    @Override
    public void requestLogin() {
        authManager.startLogin(this, new AuthManager.AuthCallback() {
            @Override
            public void onSuccess() {
            }

            @Override
            public void onError(@NonNull String message) {
                showLogin(message);
            }
        });
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleAuthIntent(intent);
    }

    @Override
    protected void onStart() {
        super.onStart();

        Fragment current = getSupportFragmentManager().findFragmentById(R.id.root_container);
        if (sessionManager.hasStoredSession()
                && !(current instanceof LoadingFragment)
                && !(current instanceof LoginFragment)
                && !hasPendingAuthAction(getIntent())) {
            showLoading();
        }
    }

    @Override
    public void onInitialDataLoaded() {
        replaceRootFragment(MainContainerFragment.newInstance(), false);
    }

    @Override
    public void onInitialDataFailed(@NonNull String message) {
        Snackbar.make(binding.getRoot(), message, Snackbar.LENGTH_LONG).show();
        showLogin(null);
    }

    @Override
    public void logout() {
        authManager.logout();
        showLogin(null);
    }

    private void showLogin(@Nullable String message) {
        replaceRootFragment(LoginFragment.newInstance(message), false);
    }

    private void showLoading() {
        replaceRootFragment(LoadingFragment.newInstance(), false);
    }

    private void handleAuthIntent(@Nullable Intent intent) {
        if (intent == null || intent.getAction() == null) {
            return;
        }

        if (AuthManager.ACTION_AUTH_COMPLETE.equals(intent.getAction())) {
            authManager.handleAuthorizationResponse(intent, new AuthManager.AuthCallback() {
                @Override
                public void onSuccess() {
                    showLoading();
                }

                @Override
                public void onError(@NonNull String message) {
                    showLogin(message);
                }
            });
            intent.setAction(null);
        } else if (AuthManager.ACTION_AUTH_CANCEL.equals(intent.getAction())) {
            showLogin("Anmeldung wurde abgebrochen.");
            intent.setAction(null);
        }
    }

    private boolean hasPendingAuthAction(@Nullable Intent intent) {
        if (intent == null || intent.getAction() == null) {
            return false;
        }
        return AuthManager.ACTION_AUTH_COMPLETE.equals(intent.getAction())
                || AuthManager.ACTION_AUTH_CANCEL.equals(intent.getAction());
    }

    private void replaceRootFragment(@NonNull Fragment fragment, boolean addToBackStack) {
        var transaction = getSupportFragmentManager()
                .beginTransaction()
                .replace(R.id.root_container, fragment);
        if (addToBackStack) {
            transaction.addToBackStack(fragment.getClass().getSimpleName());
        }
        transaction.commit();
    }
}
