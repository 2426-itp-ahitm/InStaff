package at.htlleonding.instaff.features.news;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("{companyId}/news")
public class NewsResource {
    @Inject
    NewsRepository newsRepository;
    @Inject
    NewsMapper newsMapper;

    @GET
    public Response getAll(@PathParam("companyId") Long companyId) {
        List<News> news = newsRepository.getNews(companyId);
        return Response.ok(news.stream().map(newsMapper::toResource)).build();
    }
}
