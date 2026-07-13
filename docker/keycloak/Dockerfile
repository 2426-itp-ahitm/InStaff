# keycloak/Dockerfile — production (optimized) build.
#
# Stage 1: bake in the build-time options (DB vendor, health) and run `kc.sh build`
# so the runtime start is fast and reproducible. Themes + the realm import file are
# baked into the image.
FROM quay.io/keycloak/keycloak:26.3.0 AS builder
ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true
COPY themes /opt/keycloak/themes
COPY realm-export.json /opt/keycloak/data/import/
RUN /opt/keycloak/bin/kc.sh build

# Stage 2: slim optimized runtime. All realm/user state lives in Postgres (configured
# via KC_DB_* env in docker-compose), so there is NO H2 file and no data volume.
FROM quay.io/keycloak/keycloak:26.3.0
COPY --from=builder /opt/keycloak/ /opt/keycloak/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
# Production mode (not start-dev). --import-realm imports the instaff realm on first
# start; existing realms are skipped on later starts.
CMD ["start", "--optimized", "--import-realm"]
