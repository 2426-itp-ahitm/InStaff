package at.htlleonding.instaff.ui.shifts;

import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.google.android.material.snackbar.Snackbar;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.Employee;
import at.htlleonding.instaff.data.model.Role;
import at.htlleonding.instaff.data.repository.AssignmentRepository;
import at.htlleonding.instaff.data.repository.RepositoryCallback;
import at.htlleonding.instaff.databinding.FragmentAssignmentListBinding;
import at.htlleonding.instaff.ui.main.SharedAppViewModel;
import at.htlleonding.instaff.util.AssignmentUiUtils;

public class ShiftsFragment extends Fragment implements AssignmentActionListener {
    private FragmentAssignmentListBinding binding;
    private AssignmentAdapter adapter;
    private AssignmentRepository assignmentRepository;
    private SharedAppViewModel sharedAppViewModel;
    private final List<RoleFilterOption> roleFilterOptions = new ArrayList<>();
    private List<Assignment> latestAssignments = new ArrayList<>();
    private final Set<Long> employeeRoleIds = new HashSet<>();
    private Long selectedRoleId = null;

    public static ShiftsFragment newInstance() {
        return new ShiftsFragment();
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentAssignmentListBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        adapter = new AssignmentAdapter(this);
        assignmentRepository = new AssignmentRepository(requireContext());
        sharedAppViewModel = new ViewModelProvider(requireActivity()).get(SharedAppViewModel.class);

        binding.screenTitle.setText(R.string.tab_shifts);
        binding.roleFilterLayout.setVisibility(View.VISIBLE);
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        sharedAppViewModel.getEmployee().observe(getViewLifecycleOwner(), employee -> configureRoleFilter(employee));
        sharedAppViewModel.getAssignments().observe(getViewLifecycleOwner(), assignments -> {
            latestAssignments = assignments != null ? new ArrayList<>(assignments) : new ArrayList<>();
            renderFilteredAssignments();
        });
    }

    private void configureRoleFilter(@Nullable Employee employee) {
        employeeRoleIds.clear();
        roleFilterOptions.clear();
        roleFilterOptions.add(new RoleFilterOption(null, getString(R.string.shifts_role_filter_all)));

        if (employee != null) {
            for (Role role : employee.getRoles()) {
                if (role == null || TextUtils.isEmpty(role.getRoleName())) {
                    continue;
                }
                employeeRoleIds.add(role.getId());
                boolean alreadyPresent = false;
                for (RoleFilterOption option : roleFilterOptions) {
                    if (Objects.equals(option.roleId, role.getId())) {
                        alreadyPresent = true;
                        break;
                    }
                }
                if (!alreadyPresent) {
                    roleFilterOptions.add(new RoleFilterOption(role.getId(), role.getRoleName()));
                }
            }
        }

        ArrayAdapter<RoleFilterOption> filterAdapter = new ArrayAdapter<>(
                requireContext(),
                android.R.layout.simple_list_item_1,
                roleFilterOptions
        );
        binding.roleFilterDropdown.setAdapter(filterAdapter);

        RoleFilterOption selectedOption = findSelectedOption();
        if (selectedOption == null) {
            selectedRoleId = null;
            selectedOption = roleFilterOptions.get(0);
        }

        binding.roleFilterDropdown.setText(selectedOption.label, false);
        binding.roleFilterDropdown.setOnItemClickListener((parent, view, position, id) -> {
            RoleFilterOption option = filterAdapter.getItem(position);
            selectedRoleId = option != null ? option.roleId : null;
            renderFilteredAssignments();
        });

        renderFilteredAssignments();
    }

    private void renderFilteredAssignments() {
        List<Assignment> filteredAssignments = new ArrayList<>();
        for (Assignment assignment : latestAssignments) {
            if (assignment.getRole() == null) {
                continue;
            }
            long assignmentRoleId = assignment.getRole().getId();
            if (!employeeRoleIds.isEmpty() && !employeeRoleIds.contains(assignmentRoleId)) {
                continue;
            }
            if (selectedRoleId == null || assignmentRoleId == selectedRoleId) {
                filteredAssignments.add(assignment);
            }
        }
        render(filteredAssignments);
    }

    private void render(@NonNull List<Assignment> assignments) {
        List<Assignment> upcoming = AssignmentUiUtils.getUpcomingWithinThirtyDays(assignments, LocalDateTime.now());
        List<Assignment> past = AssignmentUiUtils.getPastWithinThirtyDays(assignments, LocalDateTime.now());

        List<AssignmentListItem> items = new ArrayList<>();
        if (!upcoming.isEmpty()) {
            items.add(AssignmentListItem.header(getString(R.string.section_upcoming)));
            for (Assignment assignment : upcoming) {
                items.add(AssignmentListItem.assignment(assignment));
            }
        }
        if (!past.isEmpty()) {
            items.add(AssignmentListItem.header(getString(R.string.section_past)));
            for (Assignment assignment : past) {
                items.add(AssignmentListItem.assignment(assignment));
            }
        }

        if (items.isEmpty()) {
            binding.emptyState.setVisibility(View.VISIBLE);
            binding.recyclerView.setVisibility(View.GONE);
        } else {
            binding.emptyState.setVisibility(View.GONE);
            binding.recyclerView.setVisibility(View.VISIBLE);
        }
        adapter.submitList(items);
    }

    @Nullable
    private RoleFilterOption findSelectedOption() {
        for (RoleFilterOption option : roleFilterOptions) {
            if (Objects.equals(option.roleId, selectedRoleId)) {
                return option;
            }
        }
        return null;
    }

    @Override
    public void onAccept(@NonNull Assignment assignment) {
        updateStatus(assignment, true);
    }

    @Override
    public void onDecline(@NonNull Assignment assignment) {
        updateStatus(assignment, false);
    }

    private void updateStatus(Assignment assignment, boolean accepted) {
        assignmentRepository.updateStatus(assignment.getId(), accepted, new RepositoryCallback<>() {
            @Override
            public void onSuccess(@NonNull Assignment data) {
                sharedAppViewModel.updateAssignment(data);
                showSnackbar(R.string.assignment_update_success);
            }

            @Override
            public void onError(@NonNull String message) {
                showSnackbar(message);
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }

    private void showSnackbar(int messageRes) {
        Snackbar snackbar = Snackbar.make(binding.getRoot(), messageRes, Snackbar.LENGTH_LONG);
        View anchor = getSnackbarAnchor();
        if (anchor != null) {
            snackbar.setAnchorView(anchor);
        }
        snackbar.show();
    }

    private void showSnackbar(@NonNull String message) {
        Snackbar snackbar = Snackbar.make(binding.getRoot(), message, Snackbar.LENGTH_LONG);
        View anchor = getSnackbarAnchor();
        if (anchor != null) {
            snackbar.setAnchorView(anchor);
        }
        snackbar.show();
    }

    @Nullable
    private View getSnackbarAnchor() {
        Fragment parent = getParentFragment();
        if (parent instanceof at.htlleonding.instaff.ui.main.MainContainerFragment) {
            return ((at.htlleonding.instaff.ui.main.MainContainerFragment) parent).getSnackbarAnchor();
        }
        return null;
    }

    private static final class RoleFilterOption {
        @Nullable
        private final Long roleId;
        @NonNull
        private final String label;

        private RoleFilterOption(@Nullable Long roleId, @NonNull String label) {
            this.roleId = roleId;
            this.label = label;
        }

        @NonNull
        @Override
        public String toString() {
            return label;
        }
    }
}
