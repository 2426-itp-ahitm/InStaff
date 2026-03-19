package at.htlleonding.instaff.data.repository;

import androidx.annotation.NonNull;

public interface RepositoryCallback<T> {
    void onSuccess(@NonNull T data);

    void onError(@NonNull String message);
}
