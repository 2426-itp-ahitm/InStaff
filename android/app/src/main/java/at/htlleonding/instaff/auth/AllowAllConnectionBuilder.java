package at.htlleonding.instaff.auth;

import android.net.Uri;

import net.openid.appauth.connectivity.ConnectionBuilder;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public final class AllowAllConnectionBuilder implements ConnectionBuilder {
    private static final int TIMEOUT_MS = 15_000;
    public static final AllowAllConnectionBuilder INSTANCE = new AllowAllConnectionBuilder();

    private AllowAllConnectionBuilder() {
    }

    @Override
    public HttpURLConnection openConnection(Uri uri) throws IOException {
        URL url = new URL(uri.toString());
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setConnectTimeout(TIMEOUT_MS);
        connection.setReadTimeout(TIMEOUT_MS);
        connection.setInstanceFollowRedirects(false);
        return connection;
    }
}
