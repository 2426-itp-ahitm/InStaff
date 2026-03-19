package at.htlleonding.instaff.data.repository;

import android.content.Context;

import androidx.annotation.NonNull;

import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.api.ApiClient;
import at.htlleonding.instaff.data.model.Role;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RoleRepository {
    private final Context context;

    public RoleRepository(Context context) {
        this.context = context.getApplicationContext();
    }

    public void getRoles(@NonNull RepositoryCallback<List<Role>> callback) {
        ApiClient.getInstance(context).getApi().getRoles().enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Role>> call, @NonNull Response<List<Role>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onError(context.getString(R.string.generic_load_error));
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Role>> call, @NonNull Throwable throwable) {
                callback.onError(context.getString(R.string.generic_load_error));
            }
        });
    }
}
