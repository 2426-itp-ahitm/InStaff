package at.htlleonding.instaff.ui.shifts;

import androidx.annotation.NonNull;

import at.htlleonding.instaff.data.model.Assignment;

public interface AssignmentActionListener {
    void onAccept(@NonNull Assignment assignment);

    void onDecline(@NonNull Assignment assignment);
}
