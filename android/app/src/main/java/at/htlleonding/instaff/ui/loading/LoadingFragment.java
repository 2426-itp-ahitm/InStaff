package at.htlleonding.instaff.ui.loading;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.ViewModelProvider;

import at.htlleonding.instaff.databinding.FragmentLoadingBinding;
import at.htlleonding.instaff.ui.main.SharedAppViewModel;

public class LoadingFragment extends Fragment {
    public interface LoadingHost {
        void onInitialDataLoaded();

        void onInitialDataFailed(@NonNull String message);
    }

    private FragmentLoadingBinding binding;
    private LoadingHost host;

    public static LoadingFragment newInstance() {
        return new LoadingFragment();
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        host = (LoadingHost) context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentLoadingBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        LoadingViewModel loadingViewModel = new ViewModelProvider(this).get(LoadingViewModel.class);
        SharedAppViewModel sharedAppViewModel = new ViewModelProvider(requireActivity()).get(SharedAppViewModel.class);

        loadingViewModel.getInitialData().observe(getViewLifecycleOwner(), data -> {
            if (data == null) {
                return;
            }
            sharedAppViewModel.setEmployee(data.getEmployee());
            sharedAppViewModel.setRoles(data.getRoles());
            sharedAppViewModel.setAssignments(data.getAssignments());
            host.onInitialDataLoaded();
        });

        loadingViewModel.getErrorMessage().observe(getViewLifecycleOwner(), message -> {
            if (message != null && !message.isBlank()) {
                host.onInitialDataFailed(message);
            }
        });

        loadingViewModel.loadInitialData();
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
