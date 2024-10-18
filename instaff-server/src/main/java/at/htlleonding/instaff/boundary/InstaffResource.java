package at.htlleonding.instaff.boundary;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.io.InputStream;
import jakarta.ws.rs.core.Response;

@Path("/")
public class InstaffResource {

    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response getIndexPage() {
        // Load the index.html file from the resources/web directory
        InputStream indexStream = getClass().getResourceAsStream("/web/index.html");
        if (indexStream == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("index.html not found")
                    .build();
        }

        // Return the file as an HTML response
        return Response.ok(indexStream)
                .type(MediaType.TEXT_HTML)
                .build();
    }
}
