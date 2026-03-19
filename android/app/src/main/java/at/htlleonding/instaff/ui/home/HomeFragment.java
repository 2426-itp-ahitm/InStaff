package at.htlleonding.instaff.ui.home;

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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.repository.AssignmentRepository;
import at.htlleonding.instaff.data.repository.RepositoryCallback;
import at.htlleonding.instaff.databinding.FragmentAssignmentListBinding;
import at.htlleonding.instaff.ui.main.SharedAppViewModel;
import at.htlleonding.instaff.ui.shifts.AssignmentActionListener;
import at.htlleonding.instaff.ui.shifts.AssignmentAdapter;
import at.htlleonding.instaff.ui.shifts.AssignmentListItem;
import at.htlleonding.instaff.util.AssignmentUiUtils;

public class HomeFragment extends Fragment implements AssignmentActionListener {
    private FragmentAssignmentListBinding binding;
    private AssignmentAdapter adapter;
    private AssignmentRepository assignmentRepository;
    private SharedAppViewModel sharedAppViewModel;

    public static HomeFragment newInstance() {
        return new HomeFragment();
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

        binding.screenTitle.setText(R.string.tab_home);
        binding.emptyState.setText(R.string.empty_home);
        binding.recyclerView.setLayoutManager(new LinearLayoutManager(requireContext()));
        binding.recyclerView.setAdapter(adapter);

        sharedAppViewModel.getAssignments().observe(getViewLifecycleOwner(), assignments -> render(assignments != null ? assignments : new ArrayList<>()));
    }

    private void render(@NonNull List<Assignment> assignments) {
        List<Assignment> currentWeek = AssignmentUiUtils.getCurrentWeekUpcoming(assignments, LocalDate.now(), LocalDateTime.now());
        List<AssignmentListItem> items = new ArrayList<>();
        if (currentWeek.isEmpty()) {
            binding.emptyState.setVisibility(View.VISIBLE);
            binding.recyclerView.setVisibility(View.GONE);
        } else {
            binding.emptyState.setVisibility(View.GONE);
            binding.recyclerView.setVisibility(View.VISIBLE);
            for (Assignment assignment : currentWeek) {
                items.add(AssignmentListItem.assignment(assignment));
            }
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
