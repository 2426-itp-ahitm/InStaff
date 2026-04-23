package at.htlleonding.instaff.ui.shifts;

import android.content.Context;
import android.content.res.ColorStateList;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import at.htlleonding.instaff.R;
import at.htlleonding.instaff.data.model.Assignment;
import at.htlleonding.instaff.data.model.AssignmentStatus;
import at.htlleonding.instaff.databinding.ItemAssignmentBinding;
import at.htlleonding.instaff.databinding.ItemAssignmentHeaderBinding;
import at.htlleonding.instaff.util.AssignmentUiUtils;
import at.htlleonding.instaff.util.DateUtils;

public class AssignmentAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
    private static final int TYPE_HEADER = 0;
    private static final int TYPE_ASSIGNMENT = 1;

    private final List<AssignmentListItem> items = new ArrayList<>();
    private final AssignmentActionListener actionListener;

    public AssignmentAdapter(@NonNull AssignmentActionListener actionListener) {
        this.actionListener = actionListener;
    }

    public void submitList(@NonNull List<AssignmentListItem> newItems) {
        items.clear();
        items.addAll(newItems);
        notifyDataSetChanged();
    }

    @Override
    public int getItemViewType(int position) {
        return items.get(position).getType() == AssignmentListItem.Type.HEADER ? TYPE_HEADER : TYPE_ASSIGNMENT;
    }

    @NonNull
    @Override
    public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        LayoutInflater inflater = LayoutInflater.from(parent.getContext());
        if (viewType == TYPE_HEADER) {
            return new HeaderViewHolder(ItemAssignmentHeaderBinding.inflate(inflater, parent, false));
        }
        return new AssignmentViewHolder(ItemAssignmentBinding.inflate(inflater, parent, false));
    }

    @Override
    public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, int position) {
        AssignmentListItem item = items.get(position);
        if (holder instanceof HeaderViewHolder) {
            HeaderViewHolder headerViewHolder = (HeaderViewHolder) holder;
            headerViewHolder.bind(item.getHeaderTitle());
        } else if (holder instanceof AssignmentViewHolder) {
            AssignmentViewHolder assignmentViewHolder = (AssignmentViewHolder) holder;
            assignmentViewHolder.bind(item.getAssignment(), actionListener);
        }
    }

    @Override
    public int getItemCount() {
        return items.size();
    }

    static class HeaderViewHolder extends RecyclerView.ViewHolder {
        private final ItemAssignmentHeaderBinding binding;

        HeaderViewHolder(ItemAssignmentHeaderBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(String title) {
            binding.headerTitle.setText(title);
        }
    }

    static class AssignmentViewHolder extends RecyclerView.ViewHolder {
        private final ItemAssignmentBinding binding;

        AssignmentViewHolder(ItemAssignmentBinding binding) {
            super(binding.getRoot());
            this.binding = binding;
        }

        void bind(Assignment assignment, AssignmentActionListener actionListener) {
            Context context = binding.getRoot().getContext();
            LocalDateTime now = LocalDateTime.now();
            boolean isPast = AssignmentUiUtils.isPast(assignment, now);

            binding.shiftName.setText(assignment.getShift().getShiftName());
            binding.shiftTime.setText(DateUtils.formatShiftRange(
                    assignment.getShift().getStartTime(),
                    assignment.getShift().getEndTime()
            ));
            binding.shiftRole.setText(assignment.getRole().getRoleName());

            AssignmentStatus status = AssignmentUiUtils.normalizedStatus(assignment.getStatus());
            binding.statusChip.setText(getStatusTextRes(status));
            tintChip(context, binding.getRoot(), binding.statusChip, isPast ? R.color.status_past : getStatusColorRes(status));

            binding.acceptButton.setVisibility(isPast ? View.GONE : View.VISIBLE);
            binding.declineButton.setVisibility(isPast ? View.GONE : View.VISIBLE);
            binding.acceptButton.setEnabled(AssignmentUiUtils.canAccept(status, isPast));
            binding.declineButton.setEnabled(AssignmentUiUtils.canDecline(status, isPast));

            binding.acceptButton.setOnClickListener(v -> actionListener.onAccept(assignment));
            binding.declineButton.setOnClickListener(v -> actionListener.onDecline(assignment));

            float alpha = isPast ? 0.55f : 1f;
            binding.assignmentCard.setAlpha(alpha);
        }

        private void tintChip(Context context, View root, com.google.android.material.chip.Chip chip, int colorRes) {
            int color = ContextCompat.getColor(context, colorRes);
            chip.setChipBackgroundColor(ColorStateList.valueOf(color));
            chip.setTextColor(ContextCompat.getColor(context, R.color.white));
        }

        private int getStatusTextRes(@NonNull AssignmentStatus status) {
            switch (status) {
                case CONFIRMED:
                    return R.string.status_confirmed;
                case DECLINED:
                    return R.string.status_declined;
                case REQUESTED:
                    return R.string.status_requested;
                case REQUEST_CONFIRMED:
                    return R.string.status_request_confirmed;
                case REQUEST_DECLINED:
                    return R.string.status_request_declined;
                case PENDING:
                default:
                    return R.string.status_pending;
            }
        }

        private int getStatusColorRes(@NonNull AssignmentStatus status) {
            switch (status) {
                case CONFIRMED:
                    return R.color.status_confirmed;
                case DECLINED:
                    return R.color.status_declined;
                case REQUESTED:
                    return R.color.status_requested;
                case REQUEST_CONFIRMED:
                    return R.color.status_request_confirmed;
                case REQUEST_DECLINED:
                    return R.color.status_request_declined;
                case PENDING:
                default:
                    return R.color.status_pending;
            }
        }
    }
}
