### STAGE 2: Production Environment ###
FROM nginx:1.19.8-alpine

RUN apk add --no-cache jq
RUN rm -rf ./*

COPY ./build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

COPY docker-entrypoint.sh generate_config_js.sh /
RUN chmod +x docker-entrypoint.sh generate_config_js.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]