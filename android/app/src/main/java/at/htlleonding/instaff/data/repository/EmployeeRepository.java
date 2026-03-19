package at.htlleonding.instaff.data.repository;

import android.content.Context;

import androidx.annotation.NonNull;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.api.ApiClient;
import at.htlleonding.instaff.data.model.Employee;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class EmployeeRepository {
    private final Context context;

    public EmployeeRepository(Context context) {
        this.context = context.getApplicationContext();
    }

    public void getEmployeeByKeycloakId(@NonNull String keycloakId, @NonNull RepositoryCallback<Employee> callback) {
        ApiClient.getInstance(context).getApi().getEmployeeByKeycloakId(keycloakId).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Employee> call, @NonNull Response<Employee> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onError(context.getString(R.string.generic_load_error));
                }
            }

            @Override
            public void onFailure(@NonNull Call<Employee> call, @NonNull Throwable throwable) {
                callback.onError(context.getString(R.string.generic_load_error));
            }
        });
    }

    public void updateEmployee(@NonNull Employee employee, @NonNull RepositoryCallback<Employee> callback) {
        updateEmployee(
                employee,
                employee.getFirstname(),
                employee.getLastname(),
                employee.getTelephone(),
                employee.getBirthDate(),
                employee.getAddress(),
                callback
        );
    }

    public void updateEmployee(@NonNull Employee employee,
                               @NonNull String firstname,
                               @NonNull String lastname,
                               @NonNull String telephone,
                               @NonNull String birthDate,
                               @NonNull String address,
                               @NonNull RepositoryCallback<Employee> callback) {
        ApiClient.getInstance(context).getApi().updateEmployee(
                employee.getId(),
                employee.toUpdateRequest(firstname, lastname, telephone, birthDate, address)
        ).enqueue(new Callback<>() {
            @Override
            public void onResponse(@NonNull Call<Employee> call, @NonNull Response<Employee> response) {
                if (response.isSuccessful() && response.body() != null) {
                    callback.onSuccess(response.body());
                } else {
                    callback.onError(context.getString(R.string.generic_load_error));
                }
            }

            @Override
            public void onFailure(@NonNull Call<Employee> call, @NonNull Throwable throwable) {
                callback.onError(context.getString(R.string.generic_load_error));
            }
        });
    }
}
