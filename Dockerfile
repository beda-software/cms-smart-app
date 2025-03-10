### STAGE 2: Production Environment ###
FROM nginx:1.19.8

RUN rm -rf /etc/nginx/conf.d

COPY ./build /usr/share/nginx/html

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY docker-entrypoint.sh generate_config_js.sh /
RUN chmod +x docker-entrypoint.sh generate_config_js.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]