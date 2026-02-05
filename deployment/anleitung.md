leocloud get home
kubectl apply -f keycloak-service.yaml
kubectl rollout restart deployment keycloak
kubectl port-forward svc/keycloak 8081:8080
kubectl get pods
docker build -t ghcr.io/pfarrhoferphilip/instaff-frontend:latest .
docker push ghcr.io/pfarrhoferphilip/instaff-frontend:latest  
cd /mnt/d/Schule/ITP/wirtshaus/deployment
 kubectl exec -it keycloak-f5f498774-n7qbl -- bash
 
 /opt/keycloak/bin/kc.sh start-dev --import-realm --proxy-headers forwarded --hostname=https://it210157.cloud.htl-leonding.ac.at/auth

kubectl port-forward svc/mailhog 1025:1025 8025:8025