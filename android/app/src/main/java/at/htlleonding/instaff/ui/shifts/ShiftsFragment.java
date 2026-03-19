package at.htlleonding.instaff.ui.shifts;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;

import com.google.android.material.snackbar.Snackbar;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.model.Assignment;
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
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        sharedAppViewModel.getAssignments().observe(getViewLifecycleOwner(), assignments -> render(assignments != null ? assignments : new ArrayList<>()));
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
                Snackbar.make(binding.getRoot(), R.string.assignment_update_success, Snackbar.LENGTH_LONG).show();
            }

            @Override
            public void onError(@NonNull String message) {
                Snackbar.make(binding.getRoot(), message, Snackbar.LENGTH_LONG).show();
            }
        });
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
