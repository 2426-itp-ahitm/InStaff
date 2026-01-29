leocloud get home
kubectl apply -f keycloak-service.yaml
kubectl rollout restart deployment keycloak
kubectl port-forward svc/keycloak 8081:8080
kubectl get pods
docker build -t ghcr.io/philippfarrhofer/frontend:latest .
docker push ghcr.io/philippfarrhofer/frontend:latest  