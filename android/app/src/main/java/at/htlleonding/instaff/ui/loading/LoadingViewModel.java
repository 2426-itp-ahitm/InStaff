package at.htlleonding.instaff.ui.loading;

import android.app.Application;

import androidx.annotation.NonNull;
import androidx.lifecycle.AndroidViewModel;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;

import org.json.JSONObject;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.auth.SessionManager;
import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.Employee;
import at.htlleonding.instaff.data.model.Role;
import at.htlleonding.instaff.data.repository.AssignmentRepository;
import at.htlleonding.instaff.data.repository.EmployeeRepository;
import at.htlleonding.instaff.data.repository.RepositoryCallback;
import at.htlleonding.instaff.data.repository.RoleRepository;

public class LoadingViewModel extends AndroidViewModel {
    public static class InitialData {
        private final Employee employee;
        private final List<Role> roles;
        private final List<Assignment> assignments;

        public InitialData(Employee employee, List<Role> roles, List<Assignment> assignments) {
            this.employee = employee;
            this.roles = roles;
            this.assignments = assignments;
        }

        public Employee getEmployee() {
            return employee;
        }

        public List<Role> getRoles() {
            return roles;
        }

        public List<Assignment> getAssignments() {
            return assignments;
        }
    }

    private final MutableLiveData<InitialData> initialData = new MutableLiveData<>();
    private final MutableLiveData<String> errorMessage = new MutableLiveData<>();

    public LoadingViewModel(@NonNull Application application) {
        super(application);
    }

    public LiveData<InitialData> getInitialData() {
        return initialData;
    }

    public LiveData<String> getErrorMessage() {
        return errorMessage;
    }

    public void loadInitialData() {
        String subject = extractSubject();
        if (subject == null) {
            errorMessage.setValue(getApplication().getString(R.string.session_expired_message));
            return;
        }

        EmployeeRepository employeeRepository = new EmployeeRepository(getApplication());
        RoleRepository roleRepository = new RoleRepository(getApplication());
        AssignmentRepository assignmentRepository = new AssignmentRepository(getApplication());

        employeeRepository.getEmployeeByKeycloakId(subject, new RepositoryCallback<>() {
            @Override
            public void onSuccess(@NonNull Employee employee) {
                roleRepository.getRoles(new RepositoryCallback<>() {
                    @Override
                    public void onSuccess(@NonNull List<Role> roles) {
                        assignmentRepository.getAssignments(employee.getId(), new RepositoryCallback<>() {
                            @Override
                            public void onSuccess(@NonNull List<Assignment> assignments) {
                                initialData.postValue(new InitialData(employee, roles, assignments));
                            }

                            @Override
                            public void onError(@NonNull String message) {
                                errorMessage.postValue(message);
                            }
                        });
                    }

                    @Override
                    public void onError(@NonNull String message) {
                        errorMessage.postValue(message);
                    }
                });
            }

            @Override
            public void onError(@NonNull String message) {
                errorMessage.postValue(message);
            }
        });
    }

    private String extractSubject() {
        var authState = SessionManager.getInstance(getApplication()).getAuthState();
        if (authState == null || authState.getAccessToken() == null) {
            return null;
        }

        try {
            String[] parts = authState.getAccessToken().split("\\.");
            if (parts.length < 2) {
                return null;
            }
            String payload = parts[1];
            int pad = (4 - payload.length() % 4) % 4;
            payload += "=".repeat(pad);
            String json = new String(Base64.getUrlDecoder().decode(payload), StandardCharsets.UTF_8);
            return new JSONObject(json).optString("sub", null);
        } catch (Exception exception) {
            return null;
        }
    }
}
