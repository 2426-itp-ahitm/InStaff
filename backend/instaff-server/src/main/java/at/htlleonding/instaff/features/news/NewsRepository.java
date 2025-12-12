package at.htlleonding.instaff.features.news;

import at.htlleonding.instaff.features.company.Company;
import at.htlleonding.instaff.features.employee.Employee;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import io.vertx.core.json.Json;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

import java.util.List;

@ApplicationScoped
public class NewsRepository implements PanacheRepository<News> {
    @Inject
    EntityManager entityManager;
    @Inject
    NewsSocket newsSocket;
    @Inject
    NewsMapper newsMapper;

    public List<News> getNews(long companyId) {
        return entityManager.createNamedQuery(News.FIND_BY_COMPANY, News.class).setParameter("id", companyId).getResultList();
    }

    @Transactional
    public void save(News news) {
        persist(news);
        newsSocket.broadcast(Json.encode(newsMapper.toResource(news)));
    }

    @Transactional
    public void delete(Long id) {
        deleteById(id);
    }

    @Transactional
    public void deleteAllNews(Long companyId) {
        delete("company = ?1", getEntityManager().find(Company.class, companyId));
    }
}
