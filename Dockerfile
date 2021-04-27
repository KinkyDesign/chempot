FROM nginx
COPY dist/chempot-app /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/

EXPOSE 80