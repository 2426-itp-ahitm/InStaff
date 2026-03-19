package at.htlleonding.instaff.ui.profile;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import at.htlleonding.instaff.databinding.FragmentRoleDetailBinding;

public class RoleDetailFragment extends Fragment {
    private static final String ARG_TITLE = "arg_title";
    private static final String ARG_DESCRIPTION = "arg_description";

    private FragmentRoleDetailBinding binding;

    public static RoleDetailFragment newInstance(String title, String description) {
        RoleDetailFragment fragment = new RoleDetailFragment();
        Bundle args = new Bundle();
        args.putString(ARG_TITLE, title);
        args.putString(ARG_DESCRIPTION, description);
        fragment.setArguments(args);
        return fragment;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentRoleDetailBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        binding.toolbar.setNavigationIcon(androidx.appcompat.R.drawable.abc_ic_ab_back_material);
        binding.toolbar.setNavigationOnClickListener(v -> getParentFragmentManager().popBackStack());
        binding.toolbar.setTitle(getArguments() != null ? getArguments().getString(ARG_TITLE) : "");
        binding.roleTitle.setText(getArguments() != null ? getArguments().getString(ARG_TITLE) : "");
        binding.roleDescription.setText(getArguments() != null ? getArguments().getString(ARG_DESCRIPTION) : "");
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
