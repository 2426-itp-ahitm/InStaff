package at.htlleonding.instaff.data.api;

import android.content.Context;

import androidx.annotation.NonNull;

import java.io.IOException;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.auth.AuthManager;
import at.htlleonding.instaff.auth.SessionManager;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public final class ApiClient {
    private static final String BASE_URL = "http://10.0.2.2:8080/api/";
    private static ApiClient instance;

    private final InStaffApi api;

    private ApiClient(Context context) {
        AuthManager authManager = AuthManager.getInstance(context);
        SessionManager sessionManager = SessionManager.getInstance(context);

        HttpLoggingInterceptor loggingInterceptor = new HttpLoggingInterceptor();
        loggingInterceptor.setLevel(HttpLoggingInterceptor.Level.BASIC);

        OkHttpClient client = new OkHttpClient.Builder()
                .addInterceptor(chain -> {
                    String[] tokenHolder = new String[1];
                    boolean[] failed = new boolean[1];
                    Object lock = new Object();

                    authManager.performActionWithFreshTokens(new AuthManager.TokenResultCallback() {
                        @Override
                        public void onSuccess(@NonNull String accessToken) {
                            synchronized (lock) {
                                tokenHolder[0] = accessToken;
                                lock.notifyAll();
                            }
                        }

                        @Override
                        public void onFailure() {
                            synchronized (lock) {
                                failed[0] = true;
                                lock.notifyAll();
                            }
                        }
                    });

                    synchronized (lock) {
                        while (tokenHolder[0] == null && !failed[0]) {
                            try {
                                lock.wait();
                            } catch (InterruptedException e) {
                                Thread.currentThread().interrupt();
                                throw new IOException("Interrupted", e);
                            }
                        }
                    }

                    if (failed[0] || tokenHolder[0] == null) {
                        throw new IOException("Missing access token");
                    }

                    Request request = chain.request().newBuilder()
                            .header("Authorization", "Bearer " + tokenHolder[0])
                            .build();
                    try {
                        var response = chain.proceed(request);
                        if (response.code() == 401 || response.code() == 403) {
                            sessionManager.clearSession(context.getString(R.string.session_expired_message));
                        }
                        return response;
                    } catch (IOException exception) {
                        sessionManager.clearSession(context.getString(R.string.session_expired_message));
                        throw exception;
                    }
                })
                .addInterceptor(loggingInterceptor)
                .build();

        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(BASE_URL)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        api = retrofit.create(InStaffApi.class);
    }

    public static synchronized ApiClient getInstance(Context context) {
        if (instance == null) {
            instance = new ApiClient(context.getApplicationContext());
        }
        return instance;
    }

    public InStaffApi getApi() {
        return api;
    }
}
