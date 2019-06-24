FROM nginx:1.15.2-alpine
LABEL author="Ofonime Francis"
COPY ./build /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
