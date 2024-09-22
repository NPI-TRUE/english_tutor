FROM nginx:alpine

COPY default.conf /etc/nginx/conf.d/

COPY cert.pem /etc/ssl/certs/
COPY key.pem /etc/ssl/private/