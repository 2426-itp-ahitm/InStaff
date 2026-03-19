package at.htlleonding.instaff.ui.main;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.databinding.FragmentMainContainerBinding;
import at.htlleonding.instaff.ui.home.HomeFragment;
import at.htlleonding.instaff.ui.profile.ProfileFragment;
import at.htlleonding.instaff.ui.shifts.ShiftsFragment;

public class MainContainerFragment extends Fragment {
    public interface NavigationGuard {
        boolean interceptTabChange(@NonNull Runnable continueNavigation);
    }

    public interface MainNavigationHost {
        void logout();
    }

    private FragmentMainContainerBinding binding;
    private MainNavigationHost host;
    private boolean updatingSelection;

    public static MainContainerFragment newInstance() {
        return new MainContainerFragment();
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        host = (MainNavigationHost) context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentMainContainerBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        if (savedInstanceState == null) {
            showChild(HomeFragment.newInstance(), false);
        }

        requireActivity().getOnBackPressedDispatcher().addCallback(getViewLifecycleOwner(), new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (getChildFragmentManager().getBackStackEntryCount() > 0) {
                    getChildFragmentManager().popBackStack();
                    return;
                }

                int selectedItemId = binding.bottomNavigation.getSelectedItemId();
                if (selectedItemId == R.id.menu_shifts) {
                    binding.bottomNavigation.setSelectedItemId(R.id.menu_home);
                    return;
                }
                if (selectedItemId == R.id.menu_profile) {
                    binding.bottomNavigation.setSelectedItemId(R.id.menu_home);
                    return;
                }

                setEnabled(false);
                requireActivity().onBackPressed();
            }
        });

        binding.bottomNavigation.setOnItemSelectedListener(item -> {
            if (updatingSelection) {
                return true;
            }
            if (item.getItemId() == R.id.menu_home) {
                return switchRootTab(R.id.menu_home, HomeFragment.newInstance());
            }
            if (item.getItemId() == R.id.menu_shifts) {
                return switchRootTab(R.id.menu_shifts, ShiftsFragment.newInstance());
            }
            if (item.getItemId() == R.id.menu_profile) {
                return switchRootTab(R.id.menu_profile, ProfileFragment.newInstance());
            }
            return false;
        });
    }

    public MainNavigationHost getNavigationHost() {
        return host;
    }

    @Nullable
    public View getSnackbarAnchor() {
        return binding != null ? binding.bottomNavigation : null;
    }

    private boolean switchRootTab(int menuItemId, @NonNull Fragment fragment) {
        Fragment current = getChildFragmentManager().findFragmentById(R.id.main_content_container);
        if (current instanceof NavigationGuard) {
            NavigationGuard guard = (NavigationGuard) current;
            boolean intercepted = guard.interceptTabChange(() -> {
                updatingSelection = true;
                binding.bottomNavigation.setSelectedItemId(menuItemId);
                updatingSelection = false;
                showChild(fragment, false);
            });
            if (intercepted) {
                return false;
            }
        }

        showChild(fragment, false);
        return true;
    }

    private void showChild(@NonNull Fragment fragment, boolean addToBackStack) {
        var transaction = getChildFragmentManager()
                .beginTransaction()
                .replace(R.id.main_content_container, fragment);
        if (addToBackStack) {
            transaction.addToBackStack(fragment.getClass().getSimpleName());
        }
        transaction.commit();
    }

    public void openDetail(@NonNull Fragment fragment) {
        showChild(fragment, true);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
