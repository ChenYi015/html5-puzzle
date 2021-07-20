FROM nginx
COPY bgm /usr/share/nginx/html/bgm
COPY images /usr/share/nginx/html/images
COPY js /usr/share/nginx/html/js
COPY index.html /usr/share/nginx/html/
