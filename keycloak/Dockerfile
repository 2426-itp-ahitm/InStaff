# keycloak/Dockerfile
FROM quay.io/keycloak/keycloak:26.3.0

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin

# Copy your exported realm to the import directory
COPY demo-realm.json /opt/keycloak/data/import/

# Enable realm import
RUN /opt/keycloak/bin/kc.sh build

# Use start-dev with --import-realm
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]
