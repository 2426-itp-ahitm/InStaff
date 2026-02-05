package at.htlleonding.instaff.features.news;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class NewsMapper {

    public NewsDTO toResource(final News news) {
        return new NewsDTO(news.getId(), news.assignment.getEmployee().getFullName(), news.assignmentStatus,
                news.assignment.getShift().getStartTime(), news.assignment.getShift().getId(), news.dateCreated);
    }
}
