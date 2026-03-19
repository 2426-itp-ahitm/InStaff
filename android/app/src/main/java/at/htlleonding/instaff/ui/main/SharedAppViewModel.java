package at.htlleonding.instaff.ui.main;

import androidx.annotation.NonNull;
import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import java.util.ArrayList;
import java.util.List;

import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.Employee;
import at.htlleonding.instaff.data.model.Role;

public class SharedAppViewModel extends ViewModel {
    private final MutableLiveData<Employee> employee = new MutableLiveData<>();
    private final MutableLiveData<List<Role>> roles = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<List<Assignment>> assignments = new MutableLiveData<>(new ArrayList<>());

    public LiveData<Employee> getEmployee() {
        return employee;
    }

    public void setEmployee(@NonNull Employee value) {
        employee.setValue(value);
    }

    public LiveData<List<Role>> getRoles() {
        return roles;
    }

    public void setRoles(@NonNull List<Role> value) {
        roles.setValue(value);
    }

    public LiveData<List<Assignment>> getAssignments() {
        return assignments;
    }

    public void setAssignments(@NonNull List<Assignment> value) {
        assignments.setValue(value);
    }

    public void updateAssignment(@NonNull Assignment updatedAssignment) {
        List<Assignment> current = assignments.getValue();
        if (current == null) {
            return;
        }
        List<Assignment> updated = new ArrayList<>(current.size());
        for (Assignment assignment : current) {
            if (assignment.getId() == updatedAssignment.getId()) {
                updated.add(updatedAssignment);
            } else {
                updated.add(assignment);
            }
        }
        assignments.setValue(updated);
    }
}
