package at.htlleonding.instaff.ui.login;

import android.content.Context;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.snackbar.Snackbar;

import at.htlleonding.instaff.databinding.FragmentLoginBinding;

public class LoginFragment extends Fragment {
    public interface LoginHost {
        void requestLogin();
    }

    private static final String ARG_MESSAGE = "arg_message";

    private FragmentLoginBinding binding;
    private LoginHost host;

    public static LoginFragment newInstance(@Nullable String message) {
        LoginFragment fragment = new LoginFragment();
        Bundle args = new Bundle();
        args.putString(ARG_MESSAGE, message);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        host = (LoginHost) context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        binding = FragmentLoginBinding.inflate(inflater, container, false);
        return binding.getRoot();
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        binding.loginButton.setOnClickListener(v -> host.requestLogin());
        String message = getArguments() != null ? getArguments().getString(ARG_MESSAGE) : null;
        if (message != null && !message.isBlank()) {
            Snackbar.make(binding.getRoot(), message, Snackbar.LENGTH_LONG).show();
        }
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();
        binding = null;
    }
}
