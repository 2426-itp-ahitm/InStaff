package at.htlleonding.instaff.features.reservation;

import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import java.util.List;

@Path("/reservations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ReservationResource {
    @Inject
    ReservationRepository reservationRepository;
    @Inject
    ReservationMapper reservationMapper;

    @GET
    public List<ReservationDTO> all() {
        var reservations = reservationRepository.findAll();
        return reservations
                .stream()
                .map(reservationMapper::toResource)
                .toList();
    }

}
