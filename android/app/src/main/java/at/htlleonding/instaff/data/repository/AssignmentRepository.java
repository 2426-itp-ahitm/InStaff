package at.htlleonding.instaff.data.repository;

import android.content.Context;

import androidx.annotation.NonNull;

import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.api.ApiClient;
import at.htlleonding.instaff.data.model.Assignment;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AssignmentRepository {
    private final Context context;

    public AssignmentRepository(Context context) {
        this.context = context.getApplicationContext();
    }

    public void getAssignments(long employeeId, @NonNull RepositoryCallback<List<Assignment>> callback) {
        ApiClient.getInstance(context).getApi().getAssignmentsByEmployee(employeeId).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<List<Assignment>> call, @NonNull Response<List<Assignment>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onError(context.getString(R.string.generic_load_error));
                }
            }

            @Override
            public void onFailure(@NonNull Call<List<Assignment>> call, @NonNull Throwable throwable) {
                callback.onError(context.getString(R.string.generic_load_error));
            }
        });
    }

    public void updateStatus(long assignmentId, boolean isAccepted, @NonNull RepositoryCallback<Assignment> callback) {
        ApiClient.getInstance(context).getApi().updateAssignmentStatus(assignmentId, isAccepted).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Assignment> call, @NonNull Response<Assignment> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onError(context.getString(R.string.generic_load_error));
                }
            }

            @Override
            public void onFailure(@NonNull Call<Assignment> call, @NonNull Throwable throwable) {
                callback.onError(context.getString(R.string.generic_load_error));
            }
        });
    }
}
