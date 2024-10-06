#!/bin/bash

SSL_CERT="/etc/ssl/certs/cert.pem"
SSL_KEY="/etc/ssl/private/key.pem"

cat <<EOL > /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name tuo_dominio.com; # Sostituisci con il tuo dominio

    # Redirect HTTP a HTTPS
    return 301 https://\$host\$request_uri;
}
EOL

if [[ -f $SSL_CERT && -f $SSL_KEY ]]; then
    cat <<EOL >> /etc/nginx/conf.d/default.conf
server {
    listen 443 ssl;
    server_name tuo_dominio.com; # Sostituisci con il tuo dominio

    ssl_certificate $SSL_CERT;
    ssl_certificate_key $SSL_KEY;

    location / {
        proxy_pass http://client:5173;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/ {
        proxy_pass http://backend:7123;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOL
fi

# Ricarica Nginx per applicare le modifiche
nginx -s reload