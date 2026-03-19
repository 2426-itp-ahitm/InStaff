package at.htlleonding.instaff.ui.profile;

import android.app.DatePickerDialog;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import com.google.android.material.snackbar.Snackbar;

import java.time.LocalDate;
import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.model.Employee;
import at.htlleonding.instaff.data.model.Role;
import at.htlleonding.instaff.data.repository.EmployeeRepository;
import at.htlleonding.instaff.data.repository.RepositoryCallback;
import at.htlleonding.instaff.databinding.FragmentProfileBinding;
import at.htlleonding.instaff.databinding.ItemRoleRowBinding;
import at.htlleonding.instaff.ui.main.MainContainerFragment;
import at.htlleonding.instaff.ui.main.SharedAppViewModel;
import at.htlleonding.instaff.util.DateUtils;

public class ProfileFragment extends Fragment implements MainContainerFragment.NavigationGuard {
    private FragmentProfileBinding binding;
    private SharedAppViewModel sharedAppViewModel;
    private EmployeeRepository employeeRepository;
    private Employee originalEmployee;
    private boolean isEditing;

    public static ProfileFragment newInstance() {
        return new ProfileFragment();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentProfileBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        sharedAppViewModel = new ViewModelProvider(requireActivity()).get(SharedAppViewModel.class);
        employeeRepository = new EmployeeRepository(requireContext());

        binding.profileToolbar.setTitle(getString(R.string.tab_profile));
        setDisplayOnly(binding.emailInput);
        setDisplayOnly(binding.hourlyWageInput);
        setDisplayOnly(binding.companyNameInput);
        setDisplayOnly(binding.managerStatusInput);
        binding.editButton.setOnClickListener(v -> toggleEditMode(true));
        binding.saveButton.setOnClickListener(v -> saveProfile());
        binding.cancelButton.setOnClickListener(v -> showDiscardDialog(() -> {
            bindEmployee(originalEmployee);
            toggleEditMode(false);
        }, false));
        binding.logoutButton.setOnClickListener(v -> attemptLogout());
        binding.birthDateInput.setOnClickListener(v -> openDatePicker());
        binding.birthDateInput.setFocusable(false);

        sharedAppViewModel.getEmployee().observe(getViewLifecycleOwner(), employee -> {
            if (employee == null) {
                return;
            }
            originalEmployee = employee;
            bindEmployee(employee);
        });

        OnBackPressedCallback callback = new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (hasUnsavedChanges()) {
                    showUnsavedDialog(false, () -> {
                        bindEmployee(originalEmployee);
                        toggleEditMode(false);
                        requireActivity().getOnBackPressedDispatcher().onBackPressed();
                    });
                } else {
                    setEnabled(false);
                    requireActivity().getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                }
            }
        };
        requireActivity().getOnBackPressedDispatcher().addCallback(getViewLifecycleOwner(), callback);
    }

    private void bindEmployee(Employee employee) {
        if (employee == null) {
            return;
        }
        binding.firstNameInput.setText(employee.getFirstname());
        binding.lastNameInput.setText(employee.getLastname());
        binding.emailInput.setText(employee.getEmail());
        binding.telephoneInput.setText(employee.getTelephone());
        binding.birthDateInput.setText(DateUtils.formatBirthDate(employee.getBirthDate()));
        binding.addressInput.setText(employee.getAddress());
        binding.hourlyWageInput.setText(getString(R.string.currency_per_hour, DateUtils.formatHourlyWage(employee.getHourlyWage())));
        binding.companyNameInput.setText(employee.getCompany() != null ? employee.getCompany().getCompanyName() : "-");
        binding.managerStatusInput.setText(employee.isManager() ? R.string.manager_yes : R.string.manager_no);
        renderRoles(employee.getRoles());
        toggleEditMode(false);
    }

    private void renderRoles(List<Role> roles) {
        binding.rolesContainer.removeAllViews();
        if (roles == null || roles.isEmpty()) {
            binding.rolesEmptyState.setVisibility(View.VISIBLE);
            return;
        }
        binding.rolesEmptyState.setVisibility(View.GONE);
        LayoutInflater inflater = LayoutInflater.from(requireContext());
        for (Role role : roles) {
            ItemRoleRowBinding rowBinding = ItemRoleRowBinding.inflate(inflater, binding.rolesContainer, false);
            rowBinding.roleName.setText(role.getRoleName());
            rowBinding.getRoot().setOnClickListener(v -> openRoleDetail(role));
            binding.rolesContainer.addView(rowBinding.getRoot());
        }
    }

    private void openRoleDetail(Role role) {
        Fragment fragment = RoleDetailFragment.newInstance(role.getRoleName(), role.getDescription());
        ((MainContainerFragment) getParentFragment()).openDetail(fragment);
    }

    private void toggleEditMode(boolean enabled) {
        isEditing = enabled;
        setEditable(binding.firstNameInput, enabled);
        setEditable(binding.lastNameInput, enabled);
        setEditable(binding.telephoneInput, enabled);
        setEditable(binding.birthDateInput, enabled);
        setEditable(binding.addressInput, enabled);

        binding.editButton.setVisibility(enabled ? View.GONE : View.VISIBLE);
        binding.saveButton.setVisibility(enabled ? View.VISIBLE : View.GONE);
        binding.cancelButton.setVisibility(enabled ? View.VISIBLE : View.GONE);
    }

    private void setEditable(com.google.android.material.textfield.TextInputEditText editText, boolean editable) {
        editText.setEnabled(true);
        editText.setFocusable(editable);
        editText.setFocusableInTouchMode(editable);
        editText.setClickable(editable);
        editText.setCursorVisible(editable);
    }

    private void setDisplayOnly(com.google.android.material.textfield.TextInputEditText editText) {
        editText.setEnabled(true);
        editText.setFocusable(false);
        editText.setFocusableInTouchMode(false);
        editText.setClickable(false);
        editText.setCursorVisible(false);
    }

    private void openDatePicker() {
        if (!isEditing) {
            return;
        }
        LocalDate current = originalEmployee != null ? DateUtils.parseBirthDate(originalEmployee.getBirthDate()) : LocalDate.now();
        DatePickerDialog pickerDialog = new DatePickerDialog(
                requireContext(),
                (view, year, month, dayOfMonth) -> binding.birthDateInput.setText(String.format("%02d.%02d.%04d", dayOfMonth, month + 1, year)),
                current.getYear(),
                current.getMonthValue() - 1,
                current.getDayOfMonth()
        );
        pickerDialog.show();
    }

    private void saveProfile() {
        clearErrors();
        if (!validate()) {
            return;
        }

        Employee employee = originalEmployee;
        employee.setFirstname(textOf(binding.firstNameInput));
        employee.setLastname(textOf(binding.lastNameInput));
        employee.setTelephone(textOf(binding.telephoneInput));
        employee.setAddress(textOf(binding.addressInput));
        employee.setBirthDate(LocalDate.parse(toIsoDate(textOf(binding.birthDateInput))).toString());

        employeeRepository.updateEmployee(employee, new RepositoryCallback<>() {
            @Override
            public void onSuccess(@NonNull Employee data) {
                originalEmployee = data;
                sharedAppViewModel.setEmployee(data);
                Snackbar.make(binding.getRoot(), R.string.save_success, Snackbar.LENGTH_LONG).show();
                bindEmployee(data);
            }

            @Override
            public void onError(@NonNull String message) {
                Snackbar.make(binding.getRoot(), message, Snackbar.LENGTH_LONG).show();
            }
        });
    }

    private String toIsoDate(String displayDate) {
        String[] parts = displayDate.split("\\.");
        return parts[2] + "-" + parts[1] + "-" + parts[0];
    }

    private boolean validate() {
        boolean isValid = true;
        if (textOf(binding.firstNameInput).isBlank()) {
            binding.firstNameLayout.setError(getString(R.string.required_error));
            isValid = false;
        }
        if (textOf(binding.lastNameInput).isBlank()) {
            binding.lastNameLayout.setError(getString(R.string.required_error));
            isValid = false;
        }
        if (textOf(binding.telephoneInput).isBlank()) {
            binding.telephoneLayout.setError(getString(R.string.required_error));
            isValid = false;
        }
        if (textOf(binding.addressInput).isBlank()) {
            binding.addressLayout.setError(getString(R.string.required_error));
            isValid = false;
        }
        if (textOf(binding.birthDateInput).isBlank()) {
            binding.birthDateLayout.setError(getString(R.string.required_error));
            isValid = false;
        } else {
            LocalDate date = LocalDate.parse(toIsoDate(textOf(binding.birthDateInput)));
            if (date.isAfter(LocalDate.now())) {
                binding.birthDateLayout.setError(getString(R.string.birthdate_future_error));
                isValid = false;
            }
        }
        return isValid;
    }

    private void clearErrors() {
        binding.firstNameLayout.setError(null);
        binding.lastNameLayout.setError(null);
        binding.telephoneLayout.setError(null);
        binding.birthDateLayout.setError(null);
        binding.addressLayout.setError(null);
    }

    private boolean hasUnsavedChanges() {
        if (!isEditing || originalEmployee == null) {
            return false;
        }
        return !textOf(binding.firstNameInput).equals(originalEmployee.getFirstname())
                || !textOf(binding.lastNameInput).equals(originalEmployee.getLastname())
                || !textOf(binding.telephoneInput).equals(originalEmployee.getTelephone())
                || !textOf(binding.addressInput).equals(originalEmployee.getAddress())
                || !textOf(binding.birthDateInput).equals(DateUtils.formatBirthDate(originalEmployee.getBirthDate()));
    }

    private void attemptLogout() {
        Runnable logoutAction = () -> {
            new AlertDialog.Builder(requireContext())
                    .setMessage(R.string.logout_confirm_message)
                    .setPositiveButton(R.string.logout, (dialog, which) -> ((MainContainerFragment) getParentFragment()).getNavigationHost().logout())
                    .setNegativeButton(R.string.cancel, null)
                    .show();
        };

        if (hasUnsavedChanges()) {
            showUnsavedDialog(true, logoutAction);
        } else {
            logoutAction.run();
        }
    }

    private void showDiscardDialog(Runnable onDiscard, boolean forLogout) {
        if (hasUnsavedChanges()) {
            showUnsavedDialog(forLogout, onDiscard);
        } else {
            onDiscard.run();
        }
    }

    private void showUnsavedDialog(boolean forLogout, Runnable onDiscard) {
        new AlertDialog.Builder(requireContext())
                .setMessage(forLogout ? R.string.unsaved_logout_message : R.string.unsaved_leave_message)
                .setPositiveButton(R.string.save, (dialog, which) -> saveProfile())
                .setNeutralButton(R.string.cancel, null)
                .setNegativeButton(R.string.discard, (dialog, which) -> onDiscard.run())
                .show();
    }

    private String textOf(com.google.android.material.textfield.TextInputEditText editText) {
        return editText.getText() == null ? "" : editText.getText().toString().trim();
    }

    @Override
    public boolean interceptTabChange(@NonNull Runnable continueNavigation) {
        if (!hasUnsavedChanges()) {
            return false;
        }
        showUnsavedDialog(false, () -> {
            bindEmployee(originalEmployee);
            continueNavigation.run();
        });
        return true;
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
